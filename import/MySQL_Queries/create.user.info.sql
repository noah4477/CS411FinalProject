DROP TABLE IF EXISTS user_info;
CREATE TABLE user_info (
	uid VARCHAR(10),
    firstName TEXT,
    lastName TEXT,
    
    PRIMARY KEY (uid)
);