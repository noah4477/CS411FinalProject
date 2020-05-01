DROP TABLE IF EXISTS name_basics;
CREATE TABLE name_basics (
	nconst VARCHAR(10),
    primaryName VARCHAR(255),
    birthYear INT,
    deathYear INT,
    primaryProfession VARCHAR(255),
    knownForTitles VARCHAR(255),
    
    PRIMARY KEY (nconst),
    INDEX (primaryName),
    INDEX (primaryProfession),
    INDEX (knownForTitles)
);   
LOAD DATA INFILE "/var/lib/mysql-files/name.basics.tsv" INTO table name_basics IGNORE 1 LINES;