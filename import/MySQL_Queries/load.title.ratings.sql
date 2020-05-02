DROP TABLE IF EXISTS title_ratings;
CREATE TABLE title_ratings (
	tconst VARCHAR(10),
    averageRating REAL,
    numVotes INT,
    
    PRIMARY KEY (tconst),
    INDEX (averageRating)
);
LOAD DATA INFILE "/var/lib/mysql-files/title.ratings.tsv" INTO table title_ratings IGNORE 1 LINES;