CREATE DEFINER=`root`@`%` PROCEDURE `recommend_movie`(
	IN uid_search VARCHAR(10))
BEGIN
SELECT DISTINCT tconst, averageRating * stars AS overallRating
FROM (SELECT nconst, SUBSTRING_INDEX(genres,',',1) AS genre1,
	SUBSTRING_INDEX(SUBSTRING_INDEX(genres,',',2),',',-1) AS genre2,
	SUBSTRING_INDEX(SUBSTRING_INDEX(genres,',',3),',',-1) AS genre3, stars
FROM (SELECT tconst, primaryTitle, genres FROM title_basics WHERE titleType = "movie") AS TB 
NATURAL JOIN (SELECT tconst, nconst FROM title_principals) AS TP NATURAL JOIN user_liked_movies
WHERE uid = uid_search) AS UT 
NATURAL JOIN (SELECT tconst, nconst FROM title_principals) AS TP 
NATURAL JOIN (SELECT tconst, primaryTitle, genres FROM title_basics WHERE titleType = "movie") AS TB 
NATURAL JOIN (SELECT tconst, averageRating FROM title_ratings) AS TR
WHERE genres LIKE CONCAT("%", genre1, "%") OR genres LIKE CONCAT("%", genre2, "%") OR genres LIKE CONCAT("%", genre3, "%")
ORDER BY averageRating * stars DESC
LIMIT 10;
END