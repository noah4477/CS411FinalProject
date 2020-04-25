DROP TABLE IF EXISTS title_principals;
CREATE TABLE title_principals (
	tconst VARCHAR(10),
    ordering INT,
    nconst TEXT,
    category TEXT,
    job TEXT,
    characters TEXT,

    PRIMARY KEY (tconst, ordering)
);
LOAD DATA INFILE "/var/lib/mysql-files/title.principals.tsv" INTO table title_principals IGNORE 1 LINES;
