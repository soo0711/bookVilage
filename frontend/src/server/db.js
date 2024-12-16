const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "0110", 

  database: "bookvillage1", 
})
module.exports = db;