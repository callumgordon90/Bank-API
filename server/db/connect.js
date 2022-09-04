const { Pool } = require('pg');

// pg is a plugin that allows us to connect to postgreSQL database

//This page is where the connection to the database is configured

const pool = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'bank_account'
});

// Settings to connect to the database outlined above

const getClient = async () => {
    try {
        const client = await pool.connect();
        return client;
    } catch (error) {
        return null;
    }
};

module.exports = { pool, getClient };