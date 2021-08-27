const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Carolina*123',
        database: 'DB_Restaurante'
    });
}