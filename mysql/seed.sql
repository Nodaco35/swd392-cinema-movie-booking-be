USE cinema_booking;

INSERT INTO movies VALUES
(1,'Galactic Odyssey','Sci-Fi',132,'PG-13','English','A pilot and a scientist lead a desperate mission to save a collapsing star system.','/assets/posters/galactic-odyssey.jpg','2026-02-14'),
(2,'The Last Stand-Up','Comedy',104,'PG','English','A shy accountant enters an open-mic contest that spirals wildly out of control.','/assets/posters/last-standup.jpg','2026-01-05'),
(3,'Silent Harbor','Drama',118,'PG-13','English','In a foggy coastal town, a family confronts old secrets when the harbor dries overnight.','/assets/posters/silent-harbor.jpg','2025-12-01');

INSERT INTO cinemas VALUES
(1,'Downtown Cinema Plaza','Metro City','12 Market Street, Metro City','+1-555-0101'),
(2,'Riverside Cineplex','Riverside','88 Riverside Drive, Riverside','+1-555-0202');

INSERT INTO auditorium VALUES
(1,1,'Screen 1',40),
(2,1,'Screen 2',40),
(3,2,'Hall A',40);

INSERT INTO showtimes VALUES
(1,1,1,1,'2026-03-12 15:00:00','2026-03-12 17:15:00',12.5),
(2,1,1,1,'2026-03-12 20:00:00','2026-03-12 22:15:00',14.5),
(3,1,2,3,'2026-03-13 18:30:00','2026-03-13 20:45:00',13),
(4,2,1,2,'2026-03-12 16:00:00','2026-03-12 17:45:00',11),
(5,2,2,3,'2026-03-13 19:00:00','2026-03-13 20:45:00',11),
(6,3,1,2,'2026-03-14 14:00:00','2026-03-14 16:00:00',10.5);

INSERT INTO users VALUES
(1,'Demo Customer','demo.customer@example.com','password123','customer'),
(2,'Second Customer','second.customer@example.com','password123','customer'),
(3,'nodaco','cuong@gmail.com','123123','customer');

INSERT INTO promotion VALUES
(1,'WELCOME10','10% off for first-time customers','percentage',10,'2026-03-01','2026-04-30',true,15),
(2,'GALAXY20','20% off Galactic Odyssey evening shows','percentage',20,'2026-03-10','2026-03-31',true,20),
(3,'TUESDAY5','$5 off Tuesday matinees','fixed',5,'2026-03-01','2026-06-30',true,10);

INSERT INTO booking VALUES
(1,1,1,1,1,1,25,'completed',NULL,'2026-03-10 10:15:00'),
(2,1,2,4,1,2,20.9,'completed','WELCOME10','2026-03-11 19:30:00'),
(3,2,1,2,1,1,37.5,'completed','GALAXY20','2026-03-11 20:45:00'),
(4,3,1,3,2,3,104,'completed',NULL,'2026-03-12 04:29:32');

INSERT INTO payment_transactions VALUES
(1,1,1,25,'success','fake_card','2026-03-10 10:16:00','PAY-1-SUCCESS'),
(2,2,1,20.9,'success','fake_card','2026-03-11 19:31:00','PAY-2-SUCCESS'),
(3,3,2,37.5,'success','fake_card','2026-03-11 20:46:00','PAY-3-SUCCESS'),
(4,NULL,1,18,'failed','fake_card','2026-03-09 18:05:00','PAY-4-FAILED');