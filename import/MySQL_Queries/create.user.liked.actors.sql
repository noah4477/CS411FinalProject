DROP TABLE IF EXISTS user_liked_actors;
CREATE TABLE user_liked_movies (
	uid VARCHAR(10),
    nconst VARCHAR(10),
    stars INT,

    PRIMARY KEY (uid, nconst)
);