var mysql = require('mysql');
var neo4j = require('neo4j-driver');
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

/*
********************
    MYSQL DB Setup
********************
*/

const driver = neo4j.driver("neo4j://neo4j",
 neo4j.auth.basic(process.env.NEO4J_Credentials.substring(0,process.env.NEO4J_Credentials.indexOf('/')),
 process.env.NEO4J_Credentials.substring(process.env.NEO4J_Credentials.indexOf('/') + 1)));

console.log("Connected to Neo4j instance!");

module.exports = { mysql: mysqlcon, neo4j: driver }