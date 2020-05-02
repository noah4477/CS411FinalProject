DROP TABLE IF EXISTS user_info;
CREATE TABLE user_info (
	uid VARCHAR(10),
    username VARCHAR(255),
	passwordHash VARCHAR(255),
    firstName VARCHAR(255),
    lastName  VARCHAR(255),
    
    PRIMARY KEY (username)
);