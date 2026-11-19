const mysql = require('mysql2');

// Un pool reutiliza conexiones y se recupera solo si MySQL las cierra.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'dism',
  password: 'Dism2026!',
  database: 'dism',
  dateStrings: true, // los DATETIME llegan como texto, sin líos de zona horaria
});

module.exports = pool.promise();
