__path = process.cwd();

require(__path + '/config.js');

const mysql = require('mysql');

const db = mysql.createConnection({
  host: global.connection.host,
  user: global.connection.user,
  password: global.connection.password,
  database: global.connection.database
});

db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log('[ STATUS ] >> Berhasil terkoneksi dengan Database Mysql');
});

module.exports = db;