DROP TABLE IF EXISTS name_basics;
CREATE TABLE name_basics (
	nconst VARCHAR(10),
    primaryName TEXT,
    birthYear INT,
    deathYear INT,
    primaryProfession TEXT,
    knownForTitles TEXT,
    
    PRIMARY KEY (nconst)
);
LOAD DATA INFILE "/var/lib/mysql-files/name.basics.tsv" INTO table name_basics IGNORE 1 LINES;
