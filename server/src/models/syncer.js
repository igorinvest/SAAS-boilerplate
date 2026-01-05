// ...existing code...
const { Client } = require('pg');

/**
 * Minimal syncer: creates table if missing and adds missing columns.
 * - Accepts a pg Client (connected) or connection config object.
 * - Attributes format: same shape as /server/src/models/attributes.js where each field is an object
 *   with keys: type, allowNull, primaryKey, unique, defaultValue, validate, references.
 */

function mapDataType(type) {
    if (!type) return 'TEXT';

    if (typeof type === 'string') {
        const m = type.match(/^(\w+)(?:\((\d+)\))?/);
        if (m) {
            const key = m[1].toUpperCase();
            const len = m[2];
            if (key === 'STRING') return len ? `VARCHAR(${len})` : 'TEXT';
            if (key === 'TEXT') return 'TEXT';
            if (key === 'INTEGER') return 'INTEGER';
            if (key === 'BOOLEAN') return 'BOOLEAN';
            if (key === 'DATE') return 'TIMESTAMP WITH TIME ZONE';
            if (key === 'JSONB') return 'JSONB';
            if (key === 'FLOAT') return 'REAL';
        }
        return 'TEXT';
    }

    const key = (type.key || (type.constructor && type.constructor.name) || '').toString().toUpperCase();
    const len = type._length || (type.options && type.options.length);
    if (key.includes('STRING')) return len ? `VARCHAR(${len})` : 'TEXT';
    if (key.includes('TEXT')) return 'TEXT';
    if (key.includes('INTEGER') || key.includes('INT')) return 'INTEGER';
    if (key.includes('BOOLEAN') || key.includes('BOOL')) return 'BOOLEAN';
    if (key.includes('DATE')) return 'TIMESTAMP WITH TIME ZONE';
    if (key.includes('JSONB')) return 'JSONB';
    if (key.includes('FLOAT') || key.includes('DOUBLE') || key.includes('REAL')) return 'REAL';

    return 'TEXT';
}

function columnDefSql(colName, def, includePrimaryInCol = false) {
    const sqlType = mapDataType(def.type);
    const notNull = (def.allowNull === false || (def.validate && def.validate.notNull)) ? 'NOT NULL' : '';
    const unique = def.unique ? 'UNIQUE' : '';
    let defaultSql = '';
    if (def.defaultValue !== undefined && def.defaultValue !== null) {
        if (typeof def.defaultValue === 'number') defaultSql = `DEFAULT ${def.defaultValue}`;
        else if (typeof def.defaultValue === 'string') defaultSql = `DEFAULT '${def.defaultValue.replace(/'/g, "''")}'`;
    }
    const parts = [`"${colName}"`, sqlType, notNull, unique, defaultSql].filter(Boolean);
    if (includePrimaryInCol && def.primaryKey) parts.push('PRIMARY KEY');
    return parts.join(' ');
}

async function ensureTableExists(client, tableName, columnsSql, primaryKeys) {
    const pkSql = (primaryKeys && primaryKeys.length > 0) ? `, PRIMARY KEY (${primaryKeys.map(c => `"${c}"`).join(', ')})` : '';
    const createSql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnsSql.join(', ')}${pkSql});`;
    await client.query(createSql);
}

async function columnExists(client, tableName, columnName) {
    const res = await client.query(
        `SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2 LIMIT 1`,
        [tableName.toLowerCase(), columnName.toLowerCase()]
    );
    return res.rowCount > 0;
}

async function constraintExists(client, constraintName) {
    const res = await client.query(`SELECT 1 FROM pg_constraint WHERE conname = $1 LIMIT 1`, [constraintName]);
    return res.rowCount > 0;
}

function normalizeConstraintName(name) {
    // keep <= 60 chars and alphanumeric/_ 
    const safe = name.replace(/[^a-zA-Z0-9_]/g, '_');
    if (safe.length <= 60) return safe;
    return safe.slice(0, 54) + '_' + safe.slice(-5);
}

async function addForeignKeyConstraint(client, tableName, colName, refTable, refCol, options = {}) {
    const rawName = `fk_${tableName}_${colName}_${refTable}_${refCol}`;
    const constraintName = normalizeConstraintName(rawName);
    if (await constraintExists(client, constraintName)) return;

    const onDelete = options.onDelete ? `ON DELETE ${options.onDelete}` : '';
    const onUpdate = options.onUpdate ? `ON UPDATE ${options.onUpdate}` : '';
    const sql = `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" FOREIGN KEY ("${colName}") REFERENCES "${refTable}"("${refCol}") ${onDelete} ${onUpdate};`;
    await client.query(sql);
}

/**
 * Sync a single model/attributes to Postgres:
 * - creates table if missing (with primary key(s) if defined)
 * - adds missing columns
 * Does NOT add FK constraints when skipForeignKeys = true.
 */
async function syncModelToPostgres(clientOrConfig, tableName, attributes, options = {}) {
    const skipForeignKeys = options.skipForeignKeys === true;
    const ownClient = !(clientOrConfig instanceof Client);
    const client = ownClient ? new Client(clientOrConfig) : clientOrConfig;
    if (ownClient) await client.connect();

    try {
        const columns = [];
        const primaryKeys = [];
        for (const [colName, def] of Object.entries(attributes)) {
            if (!def || typeof def !== 'object' || Array.isArray(def)) continue;
            if (def.primaryKey) primaryKeys.push(colName);
            columns.push(columnDefSql(colName, def, false));
        }

        await ensureTableExists(client, tableName, columns, primaryKeys);

        for (const [colName, def] of Object.entries(attributes)) {
            if (!def || typeof def !== 'object') continue;
            const exists = await columnExists(client, tableName, colName);
            if (!exists) {
                const addSql = `ALTER TABLE "${tableName}" ADD COLUMN ${columnDefSql(colName, def, false)};`;
                await client.query(addSql);
            }
        }

        if (!skipForeignKeys) {
            // add FKs for this model immediately (useful when called per-model and referenced tables exist)
            for (const [colName, def] of Object.entries(attributes)) {
                if (!def || typeof def !== 'object') continue;
                if (!def.references) continue;
                let ref = def.references;
                // support shorthand: references: 'otherTable'
                if (typeof ref === 'string') ref = { model: ref };
                const refTable = (ref.model || ref.table || '').toString();
                if (!refTable) continue;
                const refCol = ref.key || ref.column || ref.referencesKey || colName;
                const fkOpts = { onDelete: ref.onDelete || ref.on_delete, onUpdate: ref.onUpdate || ref.on_update };
                await addForeignKeyConstraint(client, tableName, colName, refTable, refCol, fkOpts);
            }
        }

    } finally {
        if (ownClient) await client.end();
    }
}

/**
 * Add foreign keys for one model (used when running against all models after tables created)
 */
async function addForeignKeysForModel(client, tableName, attributes) {
    for (const [colName, def] of Object.entries(attributes)) {
        if (!def || typeof def !== 'object') continue;
        if (!def.references) continue;
        let ref = def.references;
        if (typeof ref === 'string') ref = { model: ref };
        const refTable = (ref.model || ref.table || '').toString();
        if (!refTable) continue;
        const refCol = ref.key || ref.column || ref.referencesKey || colName;
        const fkOpts = { onDelete: ref.onDelete || ref.on_delete, onUpdate: ref.onUpdate || ref.on_update };
        await addForeignKeyConstraint(client, tableName, colName, refTable, refCol, fkOpts);
    }
}

/**
 * Sync all models from attributes object.
 * Two pass approach:
 *  - pass 1: create tables and add missing columns (no FK constraints)
 *  - pass 2: add FK constraints (so referenced tables exist)
 */
async function syncAllAttributes(clientOrConfig, allAttributes) {
    const ownClient = !(clientOrConfig instanceof Client);
    const client = ownClient ? new Client(clientOrConfig) : clientOrConfig;
    if (ownClient) await client.connect();

    try {
        // pass 1: create tables and columns
        for (const [modelName, attrs] of Object.entries(allAttributes)) {
            await syncModelToPostgres(client, modelName, attrs, { skipForeignKeys: true });
        }
        // pass 2: add foreign keys
        for (const [modelName, attrs] of Object.entries(allAttributes)) {
            await addForeignKeysForModel(client, modelName, attrs);
        }
    } finally {
        if (ownClient) await client.end();
    }
}

module.exports = {
    syncModelToPostgres,
    syncAllAttributes,
};
// ...existing code...