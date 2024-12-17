const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "dbid233", 
  password: "dbpass233", 

  database: "db24331", 
})
module.exports = db;