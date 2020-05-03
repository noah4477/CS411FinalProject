const RETURN_LIMIT = 25;
const { mysql, neo4j } = require('./db.js');
const passport = require('passport');

module.exports = function(app) {
app.get("/api/isLoggedIn", passport.authenticate('jwt', {session: false}), function(req, res) {
    return res.json({user: {username: req.user.username, uid: req.user.uid}});
});

app.post("/api/getMyFavorites", passport.authenticate('jwt', {session: false}), function(req, res) {
        var query = `SELECT B.primaryTitle, A.uid, B.tconst FROM (SELECT tconst, uid FROM user_liked_movies WHERE uid = '${req.user.uid}') A LEFT JOIN (SELECT tconst, primaryTitle FROM title_basics) B ON A.tconst = B.tconst`;

        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({result: result});
        });
    })

    app.post("/api/movieLike", passport.authenticate('jwt', {session: false}), function(req, res) {
        var query = `INSERT IGNORE INTO user_liked_movies(uid, tconst) VALUES ('u000001', '${req.body.movie}')`;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({result: result});
        });
    });
    app.post("/api/movieUnlike", passport.authenticate('jwt', {session: false}), function(req, res) {
        var query = `DELETE FROM user_liked_movies WHERE uid = 'u000001' AND tconst = "${req.body.movie}"`;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({result: result});
        });
    });

    app.post("/api/getRatingInfo", passport.authenticate('jwt', {session: false}), function(req, res) {
        let query = `
        SELECT averageRating, numVotes
        FROM title_ratings A
        WHERE A.tconst = "${req.body.movie}"
        `;
        mysql.query(query, function (err, result) {
            if (err) { 
                throw err;
            }
            if (result != null && result[0] != null) {
                return res.json({averageRating: result[0].averageRating, numVotes: result[0].numVotes});
            } else {
                return res.json({averageRating: "N/A", numVotes: "N/A"})
            }
        });
    });

    app.post("/api/getPairingInfo", passport.authenticate('jwt', {session: false}), function(req, res) {
        let query = `
        SELECT A.nconst, primaryName, category, job, characters
        FROM (select nconst, category, job, characters
            FROM title_principals
            WHERE tconst = "${req.body.movie}") A 
            JOIN (SELECT * FROM name_basics) B
            ON A.nconst = B.nconst
        `;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            var arr = [];
            result.forEach(function(object){
                arr.push({
                    nconst: object.nconst,
                    primaryName: object.primaryName,
                    category: object.category,
                    job: object.job,
                    characters: object.characters
                });
            });
            res.json(arr);
        });
    });

    app.post("/api/getMovieName", passport.authenticate('jwt', {session: false}), function(req, res) {
        let query = `
        SELECT primaryTitle
        FROM title_basics
        WHERE tconst = "${req.body.movie}"
        `;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            if (result != null && result[0] != null) {
                return res.json({title: result[0].primaryTitle});
            } else {
                return res.json({title: "N/A"})
            }
        });
    });

    app.post("/api/getActorInfo", passport.authenticate('jwt', {session: false}), function(req, res) {
        let query = `
        SELECT primaryName, birthYear, deathYear, primaryProfession, knownForTitles
        FROM name_basics
        WHERE nconst = "${req.body.actor}"
        `;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            if (result != null && result[0] != null) {
                return res.json({
                    primaryName: result[0].primaryName,
                    birthYear: result[0].birthYear,
                    deathYear: result[0].deathYear,
                    primaryProfession: result[0].primaryProfession,
                    knownForTitles: result[0].knownForTitles});
            } else {
                return res.json({primaryName: "", birthYear: "", deathYear: "", primaryProfession: "", knownForTitles: ""});
            }
        });
    });

    app.post("/api/updateStarRating", passport.authenticate('jwt', {session: false}), function(req, res) {
        let id = req.body.id;
        let rating = req.body.rating;
        let type = req.body.type;
        let id_type = (type == "movie") ? "tconst" : "nconst"
        let table_name = (type == "movie") ?
         "user_liked_movies" : "user_liked_actors"
        let query = ``;
        if (rating){
            query = `
            INSERT INTO ${table_name} (uid, ${id_type}, stars)
            VALUES ('${req.user.uid}', '${id}', '${rating}')
            ON DUPLICATE KEY UPDATE
                stars = '${rating}'
            `;
        } else {
            query = `
            DELETE FROM ${table_name}
            WHERE uid = "${req.user.uid}" AND ${id_type} = "${id}" 
            `;
        }

        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({result: result});
        });
    });

    app.post("/api/getStarRating", passport.authenticate('jwt', {session: false}), function(req, res) {
        let id = req.body.id;
        let type = req.body.type;
        let id_type = (type == "movie") ? "tconst" : "nconst";
        let table_name = (type == "movie") ?
         "user_liked_movies" : "user_liked_actors"
        let query = `
        SELECT stars
        FROM ${table_name}
        WHERE uid = "${req.user.uid}" AND ${id_type} = "${id}" 
        `;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            if (result != null && result[0] != null) {
                return res.json({rating: result[0].stars});
            } else {
                return res.json({rating: null})
            }
        });
    });

    app.post("/api/search", passport.authenticate('jwt', {session: false}), function(req, res) {
        var query = "";

        if(req.body.type === "ALL")
        {
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid, B.movieStars FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "${req.body.term}%") A LEFT JOIN (SELECT uid, tconst, stars as movieStars from user_liked_movies WHERE uid = '${req.user.uid}') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
            mysql.query(query, function (err, result1) {
                if (err) throw err;
                query = `SELECT A.primaryName, A.nconst, A.knownForTitles, B.stars as actorStars from (SELECT * from name_basics) A LEFT JOIN (select * from user_liked_actors WHERE uid = '${req.user.uid}') B ON A.nconst = B.nconst WHERE primaryName like "${req.body.term}%" LIMIT ${RETURN_LIMIT}`;
                mysql.query(query, function (err, result2) {
                    if (err) throw err;
                    return res.json({titles: result1, crew: result2});
                });
            });
            return;
        }
        else if(req.body.type === "Actors") {
            query = `SELECT A.primaryName, A.nconst, A.knownForTitles, B.stars as actorStars from (SELECT * from name_basics) A LEFT JOIN (select * from user_liked_actors WHERE uid = '${req.user.uid}') B ON A.nconst = B.nconst WHERE primaryName like "${req.body.term}%" LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "Movies") {
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid, B.movieStars FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "${req.body.term}%") A LEFT JOIN (SELECT uid, tconst, stars as movieStars from user_liked_movies WHERE uid = '${req.user.uid}') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "TVShows") {
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid, B.movieStars FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "${req.body.term}%" AND titleType in ('tvepisode', 'tvseries')) A LEFT JOIN (SELECT uid, tconst, stars as movieStars from user_liked_movies WHERE uid = '${req.user.uid}') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "Directors") {
            query = `SELECT A.primaryName, A.nconst, A.knownForTitles, B.stars as actorStars from (SELECT * from name_basics) A LEFT JOIN (select * from user_liked_actors WHERE uid = '${req.user.uid}') B ON A.nconst = B.nconst WHERE primaryName like "${req.body.term}%" AND primaryProfession LIKE '%director%' LIMIT ${RETURN_LIMIT}`;
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