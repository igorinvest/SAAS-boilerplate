const { Sequelize, DataTypes } = require('sequelize');
const pgvector = require('pgvector/sequelize');

//PG vector service
pgvector.registerTypes(Sequelize);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        dialectOptions: {
            useUTC: true
        },
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false,
    }
);

module.exports.sequelize = sequelize;
module.exports.DataTypes = DataTypes;