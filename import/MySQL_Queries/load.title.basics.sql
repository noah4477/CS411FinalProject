DROP TABLE IF EXISTS title_basics;
CREATE TABLE title_basics (
	tconst VARCHAR(10),
    titleType VARCHAR(255),
    primaryTitle VARCHAR(512),
    originalTitle TEXT,
    isAdult INT,
    startYear INT,
    endYear INT,
    runtimeMinutes INT,
    genres VARCHAR(255),
    
    PRIMARY KEY (tconst),
    INDEX (primaryTitle),
    INDEX (titleType),
    INDEX (genres)
);
LOAD DATA INFILE "/var/lib/mysql-files/title.basics.tsv" INTO table title_basics IGNORE 1 LINES;