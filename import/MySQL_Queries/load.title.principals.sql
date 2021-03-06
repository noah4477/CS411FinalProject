
DROP TABLE IF EXISTS title_principals;
CREATE TABLE title_principals (
	tconst VARCHAR(10),
    ordering INT,
    nconst VARCHAR(255),
    category VARCHAR(255),
    job VARCHAR(512),
    characters TEXT,

    PRIMARY KEY (tconst, ordering),
    INDEX (nconst),
    INDEX (category),
    INDEX (job)
);
LOAD DATA INFILE "/var/lib/mysql-files/title.principals.tsv" INTO table title_principals IGNORE 1 LINES;