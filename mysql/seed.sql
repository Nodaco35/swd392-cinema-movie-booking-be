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

-- Insert seats cho auditorium_id = 1 (Screen 1 - 40 ghế)
INSERT INTO seats (id, auditorium_id, row_label, seat_number) VALUES
-- Hàng A (1-8)
(1, 1, 'A', 1), (2, 1, 'A', 2), (3, 1, 'A', 3), (4, 1, 'A', 4),
(5, 1, 'A', 5), (6, 1, 'A', 6), (7, 1, 'A', 7), (8, 1, 'A', 8),
-- Hàng B (9-16)
(9, 1, 'B', 1), (10, 1, 'B', 2), (11, 1, 'B', 3), (12, 1, 'B', 4),
(13, 1, 'B', 5), (14, 1, 'B', 6), (15, 1, 'B', 7), (16, 1, 'B', 8),
-- Hàng C (17-24)
(17, 1, 'C', 1), (18, 1, 'C', 2), (19, 1, 'C', 3), (20, 1, 'C', 4),
(21, 1, 'C', 5), (22, 1, 'C', 6), (23, 1, 'C', 7), (24, 1, 'C', 8),
-- Hàng D (25-32)
(25, 1, 'D', 1), (26, 1, 'D', 2), (27, 1, 'D', 3), (28, 1, 'D', 4),
(29, 1, 'D', 5), (30, 1, 'D', 6), (31, 1, 'D', 7), (32, 1, 'D', 8),
-- Hàng E (33-40)
(33, 1, 'E', 1), (34, 1, 'E', 2), (35, 1, 'E', 3), (36, 1, 'E', 4),
(37, 1, 'E', 5), (38, 1, 'E', 6), (39, 1, 'E', 7), (40, 1, 'E', 8);

-- Insert seats cho auditorium_id = 2 (Screen 2 - 50 ghế)
INSERT INTO seats (id, auditorium_id, row_label, seat_number) VALUES
-- Hàng A (41-50)
(41, 2, 'A', 1), (42, 2, 'A', 2), (43, 2, 'A', 3), (44, 2, 'A', 4),
(45, 2, 'A', 5), (46, 2, 'A', 6), (47, 2, 'A', 7), (48, 2, 'A', 8),
(49, 2, 'A', 9), (50, 2, 'A', 10),
-- Hàng B (51-60)
(51, 2, 'B', 1), (52, 2, 'B', 2), (53, 2, 'B', 3), (54, 2, 'B', 4),
(55, 2, 'B', 5), (56, 2, 'B', 6), (57, 2, 'B', 7), (58, 2, 'B', 8),
(59, 2, 'B', 9), (60, 2, 'B', 10),
-- Hàng C (61-70)
(61, 2, 'C', 1), (62, 2, 'C', 2), (63, 2, 'C', 3), (64, 2, 'C', 4),
(65, 2, 'C', 5), (66, 2, 'C', 6), (67, 2, 'C', 7), (68, 2, 'C', 8),
(69, 2, 'C', 9), (70, 2, 'C', 10),
-- Hàng D (71-80)
(71, 2, 'D', 1), (72, 2, 'D', 2), (73, 2, 'D', 3), (74, 2, 'D', 4),
(75, 2, 'D', 5), (76, 2, 'D', 6), (77, 2, 'D', 7), (78, 2, 'D', 8),
(79, 2, 'D', 9), (80, 2, 'D', 10),
-- Hàng E (81-90)
(81, 2, 'E', 1), (82, 2, 'E', 2), (83, 2, 'E', 3), (84, 2, 'E', 4),
(85, 2, 'E', 5), (86, 2, 'E', 6), (87, 2, 'E', 7), (88, 2, 'E', 8),
(89, 2, 'E', 9), (90, 2, 'E', 10);

-- Insert seats cho auditorium_id = 3 (Hall A - 40 ghế)
INSERT INTO seats (id, auditorium_id, row_label, seat_number) VALUES
-- Hàng A (91-100)
(91, 3, 'A', 1), (92, 3, 'A', 2), (93, 3, 'A', 3), (94, 3, 'A', 4),
(95, 3, 'A', 5), (96, 3, 'A', 6), (97, 3, 'A', 7), (98, 3, 'A', 8),
(99, 3, 'A', 9), (100, 3, 'A', 10),
-- Hàng B (101-110)
(101, 3, 'B', 1), (102, 3, 'B', 2), (103, 3, 'B', 3), (104, 3, 'B', 4),
(105, 3, 'B', 5), (106, 3, 'B', 6), (107, 3, 'B', 7), (108, 3, 'B', 8),
(109, 3, 'B', 9), (110, 3, 'B', 10),
-- Hàng C (111-120)
(111, 3, 'C', 1), (112, 3, 'C', 2), (113, 3, 'C', 3), (114, 3, 'C', 4),
(115, 3, 'C', 5), (116, 3, 'C', 6), (117, 3, 'C', 7), (118, 3, 'C', 8),
(119, 3, 'C', 9), (120, 3, 'C', 10),
-- Hàng D (121-130)
(121, 3, 'D', 1), (122, 3, 'D', 2), (123, 3, 'D', 3), (124, 3, 'D', 4),
(125, 3, 'D', 5), (126, 3, 'D', 6), (127, 3, 'D', 7), (128, 3, 'D', 8),
(129, 3, 'D', 9), (130, 3, 'D', 10);