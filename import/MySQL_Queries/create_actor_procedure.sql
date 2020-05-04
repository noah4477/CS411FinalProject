CREATE DEFINER=`root`@`%` PROCEDURE `recommend_actor`(
IN uid_search VARCHAR(10))
BEGIN

SELECT DISTINCT tconst, averageRating * stars AS overallRating
FROM (SELECT SUBSTRING_INDEX(knownForTitles,',',1) AS movie1,
	SUBSTRING_INDEX(SUBSTRING_INDEX(knownForTitles,',',2),',',-1) AS movie2,
	SUBSTRING_INDEX(SUBSTRING_INDEX(knownForTitles,',',3),',',-1) AS movie3,
	SUBSTRING_INDEX(SUBSTRING_INDEX(knownForTitles,',',4),',',-1) AS movie4, tconst, averageRating, stars
FROM (SELECT knownForTitles, stars
	FROM (SELECT nconst, knownForTitles FROM name_basics) AS NB
	NATURAL JOIN (SELECT * FROM user_liked_actors WHERE uid_search=uid) AS ULA) 
AS LM JOIN title_ratings TR) AS FINAL
WHERE movie1 = tconst OR movie2 = tconst OR movie3 = tconst OR movie4 = tconst
ORDER BY averageRating * stars DESC
LIMIT 10;
END