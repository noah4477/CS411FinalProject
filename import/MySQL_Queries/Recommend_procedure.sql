CREATE DEFINER=`root`@`%` PROCEDURE `recommend`(
	IN genre_name VARCHAR(30),
    IN actor VARCHAR(30),
    IN simple_title VARCHAR(30))
BEGIN
DECLARE genre_search VARCHAR(30);
DECLARE title_search VARCHAR(30);
SET genre_search = CONCAT("%", genre_name, "%");
SET title_search = CONCAT("%", simple_title, "%");
SELECT tconst, primaryTitle, averageRating, GROUP_CONCAT(primaryName) AS Actors
FROM (SELECT tconst, primaryTitle, startYear, runTimeMinutes, genres FROM title_basics WHERE titleType = "movie") AS TB 
NATURAL JOIN (SELECT tconst, averageRating FROM title_ratings WHERE averageRating >= 7) AS TR 
NATURAL JOIN (SELECT tconst, nconst FROM title_principals) AS TP 
NATURAL JOIN (SELECT nconst, primaryName, birthYear FROM name_basics) AS NB
WHERE genres LIKE genre_search AND (primaryTitle LIKE title_search OR nconst = actor) 
GROUP BY tconst, primaryTitle, averageRating
ORDER BY averageRating DESC, startYear DESC
LIMIT 20;
END