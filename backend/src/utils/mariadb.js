require('dotenv').config({ path: '.env.db' });
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: process.env.DB_CONNECTIONLIMIT
});

module.exports = pool;