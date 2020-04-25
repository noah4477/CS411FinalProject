DROP TABLE IF EXISTS title_crew;
CREATE TABLE title_crew (
	tconst VARCHAR(10),
    directors TEXT,
    writers TEXT,
    
    PRIMARY KEY (tconst)
);
LOAD DATA INFILE "/var/lib/mysql-files/title.crew.tsv" INTO table title_crew IGNORE 1 LINES;
