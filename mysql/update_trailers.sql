-- =========================================================
-- UPDATE trailer URLs for existing movies
-- Run this if database already has data (skip re-seeding)
-- =========================================================
USE cinema_booking;

UPDATE movies SET trailer = 'https://www.youtube.com/embed/Nd0KAySMxAM' WHERE movie_id = 1; -- Avengers: Doomsday
UPDATE movies SET trailer = 'https://www.youtube.com/embed/cBp_X_8WNRA' WHERE movie_id = 2; -- Mission Impossible 8
UPDATE movies SET trailer = 'https://www.youtube.com/embed/a3Y6tnKVTVw' WHERE movie_id = 3; -- Lilo & Stitch
UPDATE movies SET trailer = 'https://www.youtube.com/embed/c3lDuasCyNs' WHERE movie_id = 4; -- Thunderbolts*
UPDATE movies SET trailer = 'https://www.youtube.com/embed/U5GHXfQsTNI' WHERE movie_id = 5; -- Final Destination: Bloodlines
UPDATE movies SET trailer = 'https://www.youtube.com/embed/j0S7-QxGuGo' WHERE movie_id = 6; -- How to Train Your Dragon
