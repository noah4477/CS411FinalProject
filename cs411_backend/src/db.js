var mysql = require('mysql');
require('dotenv').config();

/*
********************
    MYSQL DB Setup
********************
*/

var mysqlcon = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'db'
    });

mysqlcon.connect((err) => {
    if(err) throw err;
    console.log("Connected to mysql instance!");
});

module.exports = { mysql: mysqlcon }