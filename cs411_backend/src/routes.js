module.exports = function(app) {

    app.get("/api/test", function(req, res) {
        return res.json({status: "OK", json_example_data: "DATA"});
    })
}