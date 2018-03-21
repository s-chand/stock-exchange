const Sequelize = require("sequelize");
module.exports = {
  development: {
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'company',
    host: process.env.PGHOST || 'postgres',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
  test: {
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'company',
    host: process.env.PGHOST || 'postgres',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  }
};