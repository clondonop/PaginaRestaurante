var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Carolina*123",
    database: "DB_Restaurante",
});

var arr = new Array();



connection.connect();

connection.query("SELECT * FROM clientes", function (error, results, fields) {
    if (error) throw error;
    console.log("LAS TABLAS SON: ", results);
    results.forEach(row => {
        var x = {
            idClientes: 38,
            Telefono: row.Telefono,
            Fecha_nac: row.Fecha_nac,
            Correo: row.Correo,
            Genero: row.Genero,
            Nombre: row.Nombre,
            Apellido_1: row.Apellido_1,
            Direccion: row.Direccion,
            tipo_id: row.tipo_id           
        }
        arr.push(x);
    });
    return results;
});
connection.end();


 module.exports = {
     connection: connection
}