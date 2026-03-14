-- =========================================================
-- SCHEMA THEO ERD ẢNH
-- MySQL 8+
-- =========================================================

DROP DATABASE IF EXISTS cinema_booking;
CREATE DATABASE cinema_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cinema_booking;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS payment_transactions;
DROP TABLE IF EXISTS seat_holds;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS promotion;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS showtimes;
DROP TABLE IF EXISTS auditorium;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS cinemas;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE cinemas (
    cinema_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    poster VARCHAR(255),
    trailer VARCHAR(255),
    release_date DATE,
    status ENUM('upcoming', 'now_showing', 'ended') NOT NULL DEFAULT 'now_showing'
) ENGINE=InnoDB;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB;

CREATE TABLE auditorium (
    auditorium_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('2D', '3D', 'IMAX', '4DX') NOT NULL DEFAULT '2D',
    total_seats INT NOT NULL,
    cinema_id INT NOT NULL,
    CONSTRAINT fk_auditorium_cinema
        FOREIGN KEY (cinema_id) REFERENCES cinemas(cinema_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_auditorium_name_per_cinema UNIQUE (cinema_id, name)
) ENGINE=InnoDB;

CREATE TABLE showtimes (
    showtime_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    auditorium_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_activate TINYINT(1) NOT NULL DEFAULT 1,
    base_price DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_showtimes_movie
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_showtimes_auditorium
        FOREIGN KEY (auditorium_id) REFERENCES auditorium(auditorium_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_showtimes_movie_time (movie_id, start_time),
    INDEX idx_showtimes_auditorium_time (auditorium_id, start_time)
) ENGINE=InnoDB;

CREATE TABLE seats (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    auditorium_id INT NOT NULL,
    row_name VARCHAR(5) NOT NULL,
    seat_number INT NOT NULL,
    type ENUM('standard', 'vip', 'couple') NOT NULL DEFAULT 'standard',
    CONSTRAINT fk_seats_auditorium
        FOREIGN KEY (auditorium_id) REFERENCES auditorium(auditorium_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_seat_per_auditorium UNIQUE (auditorium_id, row_name, seat_number)
) ENGINE=InnoDB;

CREATE TABLE promotion (
    promotion_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    cinema_id INT NULL,
    discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_promotion_cinema
        FOREIGN KEY (cinema_id) REFERENCES cinemas(cinema_id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE booking (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    showtime_id INT NOT NULL,
    promotion_id INT NULL,
    user_id INT NOT NULL,
    booking_time DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'paid') NOT NULL DEFAULT 'pending',
    payment_method ENUM('cash', 'momo', 'vnpay', 'zalopay', 'card') NOT NULL DEFAULT 'cash',
    total_price DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_booking_movie
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_booking_showtime
        FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_booking_promotion
        FOREIGN KEY (promotion_id) REFERENCES promotion(promotion_id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_booking_user_time (user_id, booking_time),
    INDEX idx_booking_showtime (showtime_id)
) ENGINE=InnoDB;

CREATE TABLE tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_tickets_booking
        FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_tickets_seat
        FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_ticket_booking_seat UNIQUE (booking_id, seat_id),
    INDEX idx_tickets_booking (booking_id)
) ENGINE=InnoDB;

CREATE TABLE seat_holds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    showtime_id INT NOT NULL,
    seat_id INT NOT NULL,
    user_id INT NOT NULL,
    hold_until DATETIME NOT NULL,
    status ENUM('holding', 'released', 'booked', 'expired') NOT NULL DEFAULT 'holding',
    CONSTRAINT fk_seat_holds_showtime
        FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_seat_holds_seat
        FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_seat_holds_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_hold_showtime_seat UNIQUE (showtime_id, seat_id),
    INDEX idx_seat_holds_user (user_id),
    INDEX idx_seat_holds_hold_until (hold_until)
) ENGINE=InnoDB;

CREATE TABLE payment_transactions (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    transaction_ref VARCHAR(100) NOT NULL UNIQUE,
    request_id VARCHAR(100),
    status ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    response_code VARCHAR(20),
    paid_at DATETIME NULL,
    raw_response TEXT,
    amount DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_payment_booking (booking_id)
) ENGINE=InnoDB;

-- =========================================================
-- SEED DATA
-- =========================================================

INSERT INTO cinemas (cinema_id, name, address, city) VALUES
(1, 'Galaxy Nguyễn Du', '116 Nguyễn Du, Quận 1', 'TP.HCM'),
(2, 'CGV Vincom Đồng Khởi', '72 Lê Thánh Tôn, Quận 1', 'TP.HCM'),
(3, 'Lotte Cinema Gò Vấp', '242 Nguyễn Văn Lượng, Gò Vấp', 'TP.HCM');

INSERT INTO users (user_id, full_name, email, password, phone, role) VALUES
(1, 'Nguyễn Minh Khang', 'khang.nguyen@example.com', '$2b$12$demo_hash_nguyen_minh_khang_2026', '0909123456', 'customer');

INSERT INTO movies (movie_id, title, description, duration, poster, trailer, release_date, status) VALUES
(1, 'Avengers: Endgame', 'Biệt đội Avengers bước vào trận chiến cuối cùng để đảo ngược thảm họa diệt vong.', 181, 'posters/avengers-endgame.jpg', 'trailers/avengers-endgame.mp4', '2019-04-26', 'now_showing'),
(2, 'Interstellar', 'Hành trình xuyên không gian tìm kiếm tương lai mới cho nhân loại.', 169, 'posters/interstellar.jpg', 'trailers/interstellar.mp4', '2014-11-07', 'now_showing'),
(3, 'Inception', 'Một vụ đột nhập vào giấc mơ với tầng tầng lớp lớp ý thức.', 148, 'posters/inception.jpg', 'trailers/inception.mp4', '2010-07-16', 'now_showing'),
(4, 'Dune: Part Two', 'Paul Atreides tiếp tục con đường định mệnh trên hành tinh cát Arrakis.', 166, 'posters/dune2.jpg', 'trailers/dune2.mp4', '2024-03-01', 'now_showing'),
(5, 'The Dark Knight', 'Batman đối đầu Joker trong cuộc chiến vì Gotham.', 152, 'posters/the-dark-knight.jpg', 'trailers/the-dark-knight.mp4', '2008-07-18', 'now_showing'),
(6, 'Spider-Man: No Way Home', 'Peter Parker đối diện hỗn loạn đa vũ trụ.', 148, 'posters/spiderman-nwh.jpg', 'trailers/spiderman-nwh.mp4', '2021-12-17', 'now_showing'),
(7, 'Oppenheimer', 'Câu chuyện về nhà khoa học đứng sau bom nguyên tử.', 180, 'posters/oppenheimer.jpg', 'trailers/oppenheimer.mp4', '2023-07-21', 'now_showing'),
(8, 'Your Name', 'Câu chuyện hoán đổi thân xác đầy cảm xúc giữa hai người xa lạ.', 106, 'posters/your-name.jpg', 'trailers/your-name.mp4', '2016-08-26', 'now_showing'),
(9, 'Coco', 'Cậu bé Miguel bước vào thế giới người chết để theo đuổi âm nhạc.', 105, 'posters/coco.jpg', 'trailers/coco.mp4', '2017-11-22', 'now_showing'),
(10, 'Kung Fu Panda 4', 'Po trở lại với hành trình mới để tìm người kế nhiệm.', 94, 'posters/kungfupanda4.jpg', 'trailers/kungfupanda4.mp4', '2024-03-08', 'now_showing'),
(11, 'Inside Out 2', 'Những cảm xúc mới xuất hiện trong tâm trí Riley.', 96, 'posters/insideout2.jpg', 'trailers/insideout2.mp4', '2024-06-14', 'now_showing'),
(12, 'The Batman', 'Batman điều tra chuỗi án mạng bí ẩn tại Gotham.', 176, 'posters/the-batman.jpg', 'trailers/the-batman.mp4', '2022-03-04', 'now_showing');

INSERT INTO auditorium (auditorium_id, name, type, total_seats, cinema_id) VALUES
(1, 'Phòng 1', '2D', 20, 1),
(2, 'Phòng 2', '3D', 20, 1),
(3, 'IMAX 1', 'IMAX', 20, 2),
(4, 'Phòng VIP', '2D', 20, 3);

INSERT INTO seats (seat_id, auditorium_id, row_name, seat_number, type) VALUES
-- auditorium 1
(1, 1, 'A', 1, 'standard'),
(2, 1, 'A', 2, 'standard'),
(3, 1, 'A', 3, 'standard'),
(4, 1, 'A', 4, 'standard'),
(5, 1, 'A', 5, 'standard'),
(6, 1, 'B', 1, 'standard'),
(7, 1, 'B', 2, 'standard'),
(8, 1, 'B', 3, 'standard'),
(9, 1, 'B', 4, 'standard'),
(10, 1, 'B', 5, 'standard'),
(11, 1, 'C', 1, 'vip'),
(12, 1, 'C', 2, 'vip'),
(13, 1, 'C', 3, 'vip'),
(14, 1, 'C', 4, 'vip'),
(15, 1, 'C', 5, 'vip'),
(16, 1, 'D', 1, 'couple'),
(17, 1, 'D', 2, 'couple'),
(18, 1, 'D', 3, 'couple'),
(19, 1, 'D', 4, 'couple'),
(20, 1, 'D', 5, 'couple'),

-- auditorium 2
(21, 2, 'A', 1, 'standard'),
(22, 2, 'A', 2, 'standard'),
(23, 2, 'A', 3, 'standard'),
(24, 2, 'A', 4, 'standard'),
(25, 2, 'A', 5, 'standard'),
(26, 2, 'B', 1, 'standard'),
(27, 2, 'B', 2, 'standard'),
(28, 2, 'B', 3, 'standard'),
(29, 2, 'B', 4, 'standard'),
(30, 2, 'B', 5, 'standard'),
(31, 2, 'C', 1, 'vip'),
(32, 2, 'C', 2, 'vip'),
(33, 2, 'C', 3, 'vip'),
(34, 2, 'C', 4, 'vip'),
(35, 2, 'C', 5, 'vip'),
(36, 2, 'D', 1, 'couple'),
(37, 2, 'D', 2, 'couple'),
(38, 2, 'D', 3, 'couple'),
(39, 2, 'D', 4, 'couple'),
(40, 2, 'D', 5, 'couple'),

-- auditorium 3
(41, 3, 'A', 1, 'standard'),
(42, 3, 'A', 2, 'standard'),
(43, 3, 'A', 3, 'standard'),
(44, 3, 'A', 4, 'standard'),
(45, 3, 'A', 5, 'standard'),
(46, 3, 'B', 1, 'standard'),
(47, 3, 'B', 2, 'standard'),
(48, 3, 'B', 3, 'standard'),
(49, 3, 'B', 4, 'standard'),
(50, 3, 'B', 5, 'standard'),
(51, 3, 'C', 1, 'vip'),
(52, 3, 'C', 2, 'vip'),
(53, 3, 'C', 3, 'vip'),
(54, 3, 'C', 4, 'vip'),
(55, 3, 'C', 5, 'vip'),
(56, 3, 'D', 1, 'couple'),
(57, 3, 'D', 2, 'couple'),
(58, 3, 'D', 3, 'couple'),
(59, 3, 'D', 4, 'couple'),
(60, 3, 'D', 5, 'couple'),

-- auditorium 4
(61, 4, 'A', 1, 'standard'),
(62, 4, 'A', 2, 'standard'),
(63, 4, 'A', 3, 'standard'),
(64, 4, 'A', 4, 'standard'),
(65, 4, 'A', 5, 'standard'),
(66, 4, 'B', 1, 'standard'),
(67, 4, 'B', 2, 'standard'),
(68, 4, 'B', 3, 'standard'),
(69, 4, 'B', 4, 'standard'),
(70, 4, 'B', 5, 'standard'),
(71, 4, 'C', 1, 'vip'),
(72, 4, 'C', 2, 'vip'),
(73, 4, 'C', 3, 'vip'),
(74, 4, 'C', 4, 'vip'),
(75, 4, 'C', 5, 'vip'),
(76, 4, 'D', 1, 'couple'),
(77, 4, 'D', 2, 'couple'),
(78, 4, 'D', 3, 'couple'),
(79, 4, 'D', 4, 'couple'),
(80, 4, 'D', 5, 'couple');

INSERT INTO promotion (promotion_id, code, description, start_date, end_date, cinema_id, discount_percent) VALUES
(1, 'WELCOME10', 'Giảm 10% cho người dùng mới', '2026-01-01 00:00:00', '2026-12-31 23:59:59', NULL, 10.00),
(2, 'GALAXY20', 'Giảm 20% tại Galaxy Nguyễn Du', '2026-03-01 00:00:00', '2026-06-30 23:59:59', 1, 20.00),
(3, 'WEEKEND15', 'Giảm 15% cuối tuần', '2026-03-01 00:00:00', '2026-12-31 23:59:59', NULL, 15.00);

INSERT INTO showtimes (showtime_id, movie_id, auditorium_id, start_time, end_time, is_activate, base_price) VALUES
(1, 1, 1, '2026-03-20 09:00:00', '2026-03-20 12:01:00', 1, 90000),
(2, 1, 2, '2026-03-20 19:00:00', '2026-03-20 22:01:00', 1, 110000),
(3, 2, 3, '2026-03-20 10:00:00', '2026-03-20 12:49:00', 1, 140000),
(4, 3, 1, '2026-03-20 13:30:00', '2026-03-20 15:58:00', 1, 95000),
(5, 4, 3, '2026-03-20 16:00:00', '2026-03-20 18:46:00', 1, 150000),
(6, 5, 2, '2026-03-20 21:00:00', '2026-03-20 23:32:00', 1, 105000),
(7, 6, 4, '2026-03-21 09:30:00', '2026-03-21 11:58:00', 1, 100000),
(8, 7, 3, '2026-03-21 14:00:00', '2026-03-21 17:00:00', 1, 145000),
(9, 8, 4, '2026-03-21 17:30:00', '2026-03-21 19:16:00', 1, 85000),
(10, 9, 1, '2026-03-21 18:00:00', '2026-03-21 19:45:00', 1, 80000),
(11, 10, 2, '2026-03-22 09:00:00', '2026-03-22 10:34:00', 1, 90000),
(12, 11, 4, '2026-03-22 13:00:00', '2026-03-22 14:36:00', 1, 95000),
(13, 12, 3, '2026-03-22 20:00:00', '2026-03-22 22:56:00', 1, 150000),
(14, 4, 1, '2026-03-23 10:00:00', '2026-03-23 12:46:00', 1, 100000),
(15, 7, 2, '2026-03-23 19:30:00', '2026-03-23 22:30:00', 1, 115000),
(16, 2, 4, '2026-03-24 20:30:00', '2026-03-24 23:19:00', 1, 90000);

INSERT INTO booking (booking_id, movie_id, showtime_id, promotion_id, user_id, booking_time, status, payment_method, total_price) VALUES
(1, 1, 1, 1, 1, '2026-03-18 08:10:00', 'paid', 'momo', 162000),
(2, 4, 5, 2, 1, '2026-03-18 09:00:00', 'paid', 'vnpay', 240000),
(3, 8, 9, NULL, 1, '2026-03-18 10:20:00', 'confirmed', 'cash', 170000),
(4, 11, 12, 3, 1, '2026-03-18 11:30:00', 'paid', 'card', 161500),
(5, 7, 8, NULL, 1, '2026-03-18 12:15:00', 'pending', 'momo', 145000),
(6, 2, 3, NULL, 1, '2026-03-18 13:40:00', 'paid', 'zalopay', 280000),
(7, 12, 13, 1, 1, '2026-03-18 15:00:00', 'paid', 'vnpay', 270000);

INSERT INTO tickets (ticket_id, booking_id, seat_id, price) VALUES
(1, 1, 1, 90000),
(2, 1, 2, 90000),

(3, 2, 51, 150000),
(4, 2, 52, 150000),

(5, 3, 76, 85000),
(6, 3, 77, 85000),

(7, 4, 71, 95000),
(8, 4, 72, 95000),

(9, 5, 53, 145000),

(10, 6, 41, 140000),
(11, 6, 42, 140000),

(12, 7, 54, 150000),
(13, 7, 55, 150000);

INSERT INTO seat_holds (id, showtime_id, seat_id, user_id, hold_until, status) VALUES
(1, 15, 31, 1, '2026-03-18 15:20:00', 'holding'),
(2, 16, 78, 1, '2026-03-18 15:25:00', 'holding');

INSERT INTO payment_transactions (payment_id, booking_id, transaction_ref, request_id, status, response_code, paid_at, raw_response, amount) VALUES
(1, 1, 'MOMO_TXN_0001', 'REQ_0001', 'success', '00', '2026-03-18 08:11:00', '{"provider":"momo","message":"Success"}', 162000),
(2, 2, 'VNPAY_TXN_0002', 'REQ_0002', 'success', '00', '2026-03-18 09:02:00', '{"provider":"vnpay","message":"Success"}', 240000),
(3, 4, 'CARD_TXN_0004', 'REQ_0004', 'success', '00', '2026-03-18 11:31:00', '{"provider":"card","message":"Success"}', 161500),
(4, 5, 'MOMO_TXN_0005', 'REQ_0005', 'pending', NULL, NULL, '{"provider":"momo","message":"Pending"}', 145000),
(5, 6, 'ZALOPAY_TXN_0006', 'REQ_0006', 'success', '00', '2026-03-18 13:42:00', '{"provider":"zalopay","message":"Success"}', 280000),
(6, 7, 'VNPAY_TXN_0007', 'REQ_0007', 'success', '00', '2026-03-18 15:02:00', '{"provider":"vnpay","message":"Success"}', 270000);

-- =========================================================
-- OPTIONAL CHECK
-- =========================================================
-- SELECT * FROM cinemas;
-- SELECT * FROM movies;
-- SELECT * FROM users;
-- SELECT * FROM auditorium;
-- SELECT * FROM seats;
-- SELECT * FROM showtimes;
-- SELECT * FROM promotion;
-- SELECT * FROM booking;
-- SELECT * FROM tickets;
-- SELECT * FROM seat_holds;
-- SELECT * FROM payment_transactions;