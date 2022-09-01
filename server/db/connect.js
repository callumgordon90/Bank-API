const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'bank_account'
});

//entered this code to make sure the connection works

//ends here


module.exports = { pool };