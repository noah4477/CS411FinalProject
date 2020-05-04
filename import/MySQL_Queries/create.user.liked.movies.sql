DROP TABLE IF EXISTS user_liked_movies;
CREATE TABLE user_liked_movies (
	uid VARCHAR(10),
    tconst VARCHAR(10),
    stars INT,

    PRIMARY KEY (uid, tconst)
);