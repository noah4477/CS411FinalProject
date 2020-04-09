DROP TABLE IF EXISTS title_basics;
CREATE TABLE title_basics (
	tconst VARCHAR(10),
    titleType TEXT,
    primaryTitle TEXT,
    originalTitle TEXT,
    isAdult INT,
    startYear INT,
    endYear INT,
    runtimeMinutes INT,
    genres TEXT,
    
    PRIMARY KEY (tconst)
);
LOAD DATA INFILE "/var/lib/mysql-files/title.basics.tsv" INTO table title_basics IGNORE 1 LINES;
