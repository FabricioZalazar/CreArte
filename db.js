import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fabriciozalazar_bd_artesanos_labii'

}).promise();

connection.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexion correcta');
    };
});

export default connection;