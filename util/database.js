const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'videotastic',
    database: 'test',
    password: 'videotastic'
});

module.exports = pool.promise();