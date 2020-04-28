const { mysql, neo4j } = require('./db.js');
const RETURN_LIMIT = 25;

module.exports = function(app) {

    app.post("/api/getMyFavorites", function(req, res) {
        var query = `SELECT B.primaryTitle, A.uid, B.tconst FROM (SELECT tconst, uid FROM user_liked_movies WHERE uid = '${req.body.uid}') A LEFT JOIN (SELECT tconst, primaryTitle FROM title_basics) B ON A.tconst = B.tconst`;

        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({result: result});
        });
    })

    app.post("/api/movieLike", function(req, res) {
        var query = `INSERT IGNORE INTO user_liked_movies(uid, tconst) VALUES ('u000001', '${req.body.movie}')`;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({result: result});
            });
    });
    app.post("/api/movieUnlike", function(req, res) {
        var query = `DELETE FROM user_liked_movies WHERE uid = 'u000001' AND tconst = "${req.body.movie}"`;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({result: result});
            });
    });
    app.post("/api/getRatingInfo", function(req, res) {
        let query = `SELECT averageRating, numVotes FROM title_ratings A WHERE A.tconst = "${req.body.movie}"`;
        mysql.query(query, function (err, result) {
            if (err) { 
                throw err;
            }
            console.log(result)
            return res.json({averageRating: (result || [{averageRating: -1}])[0].averageRating, numVotes: (result[0] ||  [{numVotes: 0}])[0].numVotes});
        });
    });
    app.post("/api/getPairingInfo", function(req, res) {
        let query = `SELECT primaryName, category, job, characters
        FROM (select nconst, category, job, characters
        from title_principals
        WHERE tconst = "${req.body.movie}") A JOIN (SELECT * FROM name_basics) B
        ON A.nconst = B.nconst
        `;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({primaryName: result[0].primaryName, category: result[0].category, job: result[0].job, characters: result[0].characters});
        });
    });

    app.post("/api/getActorInfo", function(req, res) {
        let query = `select primaryName, birthYear, deathYear, primaryProfession, knownForTitles
        from name_basics
        WHERE nconst = "${req.body.actor}"
        `;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({primaryName: result[0].primaryName, birthYear: result[0].birthYear, deathYear: result[0].deathYear, primaryProfession: result[0].primaryProfession, knownFortitles: result[0].knownFortitles});
        });
    });
    //SELECT B.primaryName FROM (SELECT nconst FROM title_principals WHERE tconst = 'tt0133093') A INNER JOIN (SELECT primaryName, nconst FROM name_basics) B ON A.nconst = B.nconst
    app.post("/api/search", function(req, res) {

        var query = "";

        if(req.body.type === "ALL")
        {
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "%${req.body.term}%") A LEFT JOIN (SELECT uid, tconst from user_liked_movies WHERE uid = 'u000001') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
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
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "%${req.body.term}%" AND titleType ="movie") A LEFT JOIN (SELECT uid, tconst from user_liked_movies WHERE uid = 'u000001') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "TVShows") {
             query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "%${req.body.term}%" AND titleType in ('tvepisode', 'tvseries')) A LEFT JOIN (SELECT uid, tconst from user_liked_movies WHERE uid = 'u000001') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
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
