DROP TABLE IF EXISTS title_episode;
CREATE TABLE title_episode (
	tconst VARCHAR(10),
    parentTconst TEXT,
    seasonNumber INT,
    episodeNumber INT,

    PRIMARY KEY (tconst)
);
LOAD DATA INFILE "/var/lib/mysql-files/title.episode.tsv" INTO table title_episode IGNORE 1 LINES;
