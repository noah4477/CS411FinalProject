const RETURN_LIMIT = 25;
const { mysql } = require('./db.js');
const passport = require('passport');

module.exports = function(app) {
    app.get("/api/isLoggedIn", passport.authenticate('jwt', {session: false}), function(req, res) {
        return res.json({user: {username: req.user.username, uid: req.user.uid}});
    });

    app.post("/api/getFavoriteMovies", passport.authenticate('jwt', {session: false}), function(req, res) {
        var query = `
        SELECT tconst, stars
        FROM user_liked_movies
        WHERE uid = "${req.user.uid}"
        `;

        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({favoriteMovies: result});
        });
    });

    app.post("/api/getFavoriteActors", passport.authenticate('jwt', {session: false}), function(req, res) {
        var query = `
        SELECT nconst, stars
        FROM user_liked_actors
        WHERE uid = "${req.user.uid}"
        `;

        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({favoriteActors: result});
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

    app.post("/api/getRecsByActor", passport.authenticate('jwt', {session: false}), function(req, res) {
        let query = `
        CALL recommend_actor("${req.user.uid}")
        `;
        mysql.query(query, function (err, result) {
            if (err) throw err;
            return res.json({topMovies: result});
        });
    });

    // app.post("/api/getRecsByActor", passport.authenticate('jwt', {session: false}), function(req, res) {
    //     let query = `
    //     SELECT (A.stars / 5.0) as userRating, B.knownForTitles
    //     FROM (SELECT uid, nconst, stars
    //         FROM user_liked_actors
    //         WHERE uid = "${req.user.uid}") A
    //         JOIN 
    //         (SELECT nconst, knownForTitles 
    //         FROM name_basics) B
    //         ON A.nconst = B.nconst
    //     `;
    //     console.log("Enter getRecsByActor")
    //     mysql.query(query,  function (err, recsPerActor) {
    //         if (err) throw err;
    //         effectiveRatings = [];
    //         console.log(recsPerActor)
    //         recsPerActor.forEach(function(object){
    //             userRating = object.userRating;
    //             movieIDs = object.knownForTitles.split(",");
    //             for (let i = 0; i < movieIDs.length; i++) {
    //                 console.log("i:", i)
    //                 ID = movieIDs[i];
    //                 let ratingQuery = `
    //                 SELECT averageRating
    //                 FROM title_ratings A
    //                 WHERE A.tconst = "${ID}"
    //                 `;
    //                  mysql.query(ratingQuery, function (err, movieRes) {
    //                     movieRating = movieRes.averageRating ? movieRes.averageRating / 10.0 : 0;
    //                     effectiveRating = (movieRating * userRating)
    //                     console.log({tconst: ID, rating: effectiveRating, movieRating: movieRating, userRating: userRating})
    //                     effectiveRatings.push({tconst: ID, rating: effectiveRating});
    //                 });
    //             }
    //         });
    //         effectiveRatings.sort(function(a, b) {
    //             return b.rating - a.rating;
    //         });
    //         return effectiveRatings.slice(0, 10);
    //     });
    // });

    app.post("/api/search", passport.authenticate('jwt', {session: false}), function(req, res) {
        var query = "";

        if(req.body.type === "ALL")
        {
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "${req.body.term}%") A LEFT JOIN (SELECT uid, tconst from user_liked_movies WHERE uid = 'u000001') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
            mysql.query(query, function (err, result1) {
                if (err) throw err;
                query = `SELECT primaryName, nconst, knownForTitles from name_basics WHERE primaryName like "${req.body.term}%" LIMIT ${RETURN_LIMIT}`;
                mysql.query(query, function (err, result2) {
                    if (err) throw err;
                    return res.json({titles: result1, crew: result2});
                });
            });
            return;
        }
        else if(req.body.type === "Actors") {
            query = `SELECT primaryName, nconst, knownForTitles from name_basics WHERE primaryName like "${req.body.term}%" AND (primaryProfession LIKE '%actor%' OR primaryProfession LIKE '%actress%' ) LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "Movies") {
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "${req.body.term}%" AND titleType ="movie") A LEFT JOIN (SELECT uid, tconst from user_liked_movies WHERE uid = 'u000001') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "TVShows") {
            query = `SELECT A.primarytitle, A.tconst, A.genres, B.uid FROM (SELECT primarytitle, tconst, genres from title_basics WHERE primarytitle like "${req.body.term}%" AND titleType in ('tvepisode', 'tvseries')) A LEFT JOIN (SELECT uid, tconst from user_liked_movies WHERE uid = 'u000001') B ON A.tconst = B.tconst LIMIT ${RETURN_LIMIT}`;
        }
        else if(req.body.type === "Directors") {
            query = `SELECT primaryName, nconst, knownForTitles from name_basics WHERE primaryName like "${req.body.term}%" AND primaryProfession LIKE '%director%' LIMIT ${RETURN_LIMIT}`;
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