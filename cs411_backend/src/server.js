const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const routes = require("./routes.js");

require('dotenv').config();

app.use(bodyparser.urlencoded({
    extended: true
  }));
app.use(bodyparser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });

routes(app);

app.listen(process.env.SERVER_PORT, () => { console.log("Server started listening on port: %d", process.env.SERVER_PORT); });