const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: 'bean1987'
});

module.exports = pool.promise();