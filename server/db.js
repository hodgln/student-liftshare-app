const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE_NAME
});

module.exports = pool