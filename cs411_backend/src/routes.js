const { mysql, neo4j } = require('./db.js');

module.exports = function(app) {

    app.get("/api/test", function(req, res) {
        return res.json({status: "OK", json_example_data: "DATA"});
    });

    app.get("/api/testmysql", function(req, res) {
        // SQL QUERY HERE
        mysql.query("SHOW TABLES", function (err, result) {
            if (err) throw err;
            return res.json({result: result});
          });
    });
}