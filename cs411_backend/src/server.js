const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const routes = require("./routes.js");
const secureroutes = require("./secureroutes.js");
const passport = require('passport');
require("./auth.js");
require('dotenv').config();

app.use(bodyparser.urlencoded({
    extended: true
  }));
app.use(bodyparser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
  });

routes(app);
secureroutes(app);
//app.use('/api', passport.authenticate('jwt', {session: false}), secureroutes);
app.listen(process.env.SERVER_PORT, () => { console.log("Server started listening on port: %d", process.env.SERVER_PORT); });