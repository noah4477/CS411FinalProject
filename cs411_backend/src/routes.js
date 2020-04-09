const { mysql, neo4j } = require('./db.js');
const RETURN_LIMIT = 25;

module.exports = function(app) {

    //SELECT B.primaryName FROM (SELECT nconst FROM title_principals WHERE tconst = 'tt0133093') A INNER JOIN (SELECT primaryName, nconst FROM name_basics) B ON A.nconst = B.nconst
    app.post("/api/search", function(req, res) {

        var query = "";

        if(req.body.type === "ALL")
        {
            query = `SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "%${req.body.term}%" LIMIT ${RETURN_LIMIT}`;
            mysql.query(query, function (err, result1) {
                if (err) throw err;
                query = `SELECT primaryName, nconst, knownForTitles from name_basics WHERE primaryName like "%${req.body.term}%" LIMIT ${RETURN_LIMIT}`;
                mysql.query(query, function (err, result2) {
                    if (err) throw err;
                    return res.json({titles: result1, crew: result2});
                  });
            });
            return;
        }
        else if(req.body.type === "Actors") {
            query = `SELECT primaryName, nconst, knownForTitles from name_basics WHERE primaryName like "%${req.body.term}%" AND (primaryProfession LIKE '%actor%' OR primaryProfession LIKE '%actress%' ) LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "Movies") {
            query = `SELECT primarytitle, tconst, genres  from title_basics WHERE primarytitle like "%${req.body.term}%" AND titleType ="movie" LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "TVShows") {
            query = `SELECT primarytitle, tconst, genres  from title_basics WHERE primarytitle like "%${req.body.term}%" AND titleType in ('tvepisode', 'tvseries') LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "Directors") {
            query = `SELECT primaryName, nconst, knownForTitles from name_basics WHERE primaryName like "%${req.body.term}%" AND primaryProfession LIKE '%director%' LIMIT ${RETURN_LIMIT}`;
        }
        // SQL QUERY HERE
        mysql.query(query, function (err, result) {
            if (err) throw err;
            if(req.body.type === 'Actors' || req.body.type === 'Directors')
            {
                return res.json({crew: result});
            }
            else
            {
                return res.json({titles: result});
            }
            
        });
    });
}
