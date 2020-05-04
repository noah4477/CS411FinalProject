CREATE DEFINER=`root`@`%` PROCEDURE `recommend_actor`(
	IN actor VARCHAR(30))
BEGIN

SELECT nconst, primaryName, birthYear, knownForTitles
FROM name_basics
WHERE nconst = actor;
END