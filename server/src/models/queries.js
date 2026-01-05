//Use inline sql for syntax highlight

module.exports.BaseQueries = class BaseQueries {
    createSearchTable = /*sql*/`
        create table if not exists search (
            docId bigint primary key generated always as identity,
            content text,
            fts tsvector generated always as (to_tsvector('english', content)) stored,
            embedding extensions.vector(512)
        );
    `
}
