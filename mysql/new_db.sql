-- =========================================================
-- LOTTE CINEMA BOOKING – DATABASE
-- MySQL 8+
-- Data based on LotteCinemaClone template
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
    poster VARCHAR(500),
    trailer VARCHAR(255),
    release_date DATE,
    status ENUM('upcoming', 'now_showing', 'ended') NOT NULL DEFAULT 'now_showing',
    rating VARCHAR(10) DEFAULT 'P'
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

-- ── CINEMAS (6 Lotte Cinema branches from template) ──
INSERT INTO cinemas (cinema_id, name, address, city) VALUES
(1, 'Lotte Cinema Landmark 81', 'Tầng B1, Vincom Center Landmark 81, 772 Điện Biên Phủ, Bình Thạnh', 'TP.HCM'),
(2, 'Lotte Cinema Cantavil', 'Tầng 7, Cantavil Premier, Xa Lộ Hà Nội, Quận 2', 'TP.HCM'),
(3, 'Lotte Cinema Gò Vấp', '242 Nguyễn Văn Lượng, Gò Vấp', 'TP.HCM'),
(4, 'Lotte Cinema Tây Sơn', 'Tầng 4, 29 Tây Sơn, Đống Đa', 'Hà Nội'),
(5, 'Lotte Cinema Cầu Giấy', 'Tầng 6, Lotte Center, 54 Liễu Giai, Ba Đình', 'Hà Nội'),
(6, 'Lotte Cinema Đà Nẵng', 'Tầng 5, Lotte Mart, 6 Nại Nam, Hải Châu', 'Đà Nẵng');

-- ── USERS ──
INSERT INTO users (user_id, full_name, email, password, phone, role) VALUES
(1, 'Nguyễn Văn A', 'demo.customer@example.com', 'password123', '0909123456', 'customer'),
(2, 'Admin Lotte', 'admin@lottecinema.vn', 'admin123', '0901000000', 'admin'),
(3, 'Trần Thị B', 'tran.b@example.com', 'password123', '0912345678', 'customer'),
(4, 'Lê Minh C', 'le.c@example.com', 'password123', '0923456789', 'customer');

-- ── MOVIES (from template data) ──
INSERT INTO movies (movie_id, title, description, duration, poster, trailer, release_date, status, rating) VALUES
(1, 'Avengers: Doomsday',
 'Các Avengers tập hợp lại để đối mặt với mối đe dọa lớn nhất trong lịch sử vũ trụ Marvel — Doctor Doom. Một cuộc chiến cuối cùng sẽ quyết định số phận của toàn bộ nhân loại. Đạo diễn: Anthony & Joe Russo. Diễn viên: Robert Downey Jr., Chris Evans, Scarlett Johansson.',
 148, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=570&fit=crop',
 NULL, '2025-04-30', 'now_showing', 'T18'),

(2, 'Mission Impossible 8',
 'Ethan Hunt và đội IMF một lần nữa phải đối mặt với sứ mệnh nguy hiểm nhất từ trước đến nay để cứu thế giới khỏi thảm họa hạt nhân. Đạo diễn: Christopher McQuarrie. Diễn viên: Tom Cruise, Hayley Atwell, Ving Rhames.',
 163, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=570&fit=crop',
 NULL, '2025-05-23', 'now_showing', 'T13'),

(3, 'Lilo & Stitch',
 'Phiên bản live-action của bộ phim hoạt hình kinh điển Disney về cô bé Lilo và sinh vật ngoài hành tinh dễ thương Stitch. Đạo diễn: Dean Fleischer Camp. Diễn viên: Maia Kealoha, Sydney Agudong, Zach Galifianakis.',
 108, 'https://images.unsplash.com/photo-1625891262037-abf5d4a10a52?w=400&h=570&fit=crop',
 NULL, '2025-05-22', 'now_showing', 'P'),

(4, 'Thunderbolts*',
 'Một nhóm các nhân vật phản diện và chống anh hùng tập hợp lại để thực hiện một sứ mệnh bí ẩn dưới sự lãnh đạo của chính phủ Mỹ. Đạo diễn: Jake Schreier. Diễn viên: Florence Pugh, Sebastian Stan, David Harbour.',
 127, 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=570&fit=crop',
 NULL, '2025-05-01', 'now_showing', 'T13'),

(5, 'Final Destination: Bloodlines',
 'Phần tiếp theo của loạt phim kinh dị đình đám, nơi số phận và cái chết không thể tránh khỏi tiếp tục rượt đuổi những người sống sót. Đạo diễn: Zach Lipovsky & Adam B. Stein. Diễn viên: Teo Briones, Kaitlyn Santa Juana, Richard Harmon.',
 110, 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=570&fit=crop',
 NULL, '2025-05-16', 'now_showing', 'C18'),

(6, 'How to Train Your Dragon',
 'Phiên bản live-action của bộ phim hoạt hình yêu thích về tình bạn giữa chàng Viking trẻ Hiccup và con rồng Toothless. Đạo diễn: Dean DeBlois. Diễn viên: Mason Thames, Nico Parker, Gerard Butler.',
 124, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=570&fit=crop',
 NULL, '2025-06-13', 'upcoming', 'P');

-- ── AUDITORIUMS (multiple formats per cinema, like template) ──
-- Cinema 1: Landmark 81 (4 halls)
INSERT INTO auditorium (auditorium_id, name, type, total_seats, cinema_id) VALUES
(1,  'Phòng 1 - 2D',  '2D',   96, 1),
(2,  'Phòng 2 - 3D',  '3D',   96, 1),
(3,  'Phòng 3 - 4DX', '4DX',  96, 1),
(4,  'Phòng IMAX',     'IMAX', 96, 1),
-- Cinema 2: Cantavil (3 halls)
(5,  'Phòng 1 - 2D',  '2D',   96, 2),
(6,  'Phòng 2 - 3D',  '3D',   96, 2),
(7,  'Phòng IMAX',     'IMAX', 96, 2),
-- Cinema 3: Gò Vấp (3 halls)
(8,  'Phòng 1 - 2D',  '2D',   96, 3),
(9,  'Phòng 2 - 3D',  '3D',   96, 3),
(10, 'Phòng 3 - 4DX', '4DX',  96, 3),
-- Cinema 4: Tây Sơn (2 halls)
(11, 'Phòng 1 - 2D',  '2D',   96, 4),
(12, 'Phòng 2 - 3D',  '3D',   96, 4),
-- Cinema 5: Cầu Giấy (3 halls)
(13, 'Phòng 1 - 2D',  '2D',   96, 5),
(14, 'Phòng 2 - 3D',  '3D',   96, 5),
(15, 'Phòng IMAX',     'IMAX', 96, 5),
-- Cinema 6: Đà Nẵng (2 halls)
(16, 'Phòng 1 - 2D',  '2D',   96, 6),
(17, 'Phòng 2 - 3D',  '3D',   96, 6);

-- ── SEATS (8 rows x 12 cols per auditorium, rows E-G are VIP) ──
-- Generate seats for all 17 auditoriums
-- Each auditorium: A1-A12 (standard), B1-B12 (standard), C1-C12 (standard), D1-D12 (standard),
--                  E1-E12 (vip), F1-F12 (vip), G1-G12 (vip), H1-H12 (standard)

DELIMITER //
DROP PROCEDURE IF EXISTS generate_seats//
CREATE PROCEDURE generate_seats()
BEGIN
    DECLARE aud_id INT DEFAULT 1;
    DECLARE row_idx INT;
    DECLARE col_idx INT;
    DECLARE row_char CHAR(1);
    DECLARE seat_type VARCHAR(10);

    WHILE aud_id <= 17 DO
        SET row_idx = 0;
        WHILE row_idx < 8 DO
            SET row_char = CHAR(65 + row_idx);
            IF row_char IN ('E', 'F', 'G') THEN
                SET seat_type = 'vip';
            ELSE
                SET seat_type = 'standard';
            END IF;

            SET col_idx = 1;
            WHILE col_idx <= 12 DO
                INSERT INTO seats (auditorium_id, row_name, seat_number, type)
                VALUES (aud_id, row_char, col_idx, seat_type);
                SET col_idx = col_idx + 1;
            END WHILE;

            SET row_idx = row_idx + 1;
        END WHILE;
        SET aud_id = aud_id + 1;
    END WHILE;
END//
DELIMITER ;

CALL generate_seats();
DROP PROCEDURE IF EXISTS generate_seats;

-- ── PROMOTIONS ──
INSERT INTO promotion (promotion_id, code, description, start_date, end_date, cinema_id, discount_percent) VALUES
(1, 'WELCOME10',  'Giảm 10% cho người dùng mới',                '2025-01-01 00:00:00', '2026-12-31 23:59:59', NULL, 10.00),
(2, 'LOTTE20',    'Giảm 20% tại Lotte Cinema Landmark 81',      '2025-03-01 00:00:00', '2025-12-31 23:59:59', 1,    20.00),
(3, 'WEEKEND15',  'Giảm 15% cuối tuần',                          '2025-03-01 00:00:00', '2026-12-31 23:59:59', NULL, 15.00),
(4, 'MUA1TANG1',  'Mua 1 tặng 1 mỗi thứ 4 hàng tuần',          '2025-01-01 00:00:00', '2025-12-31 23:59:59', NULL, 50.00),
(5, 'THANHVIEN',  'Giảm 10% cho thành viên Lotte',               '2025-01-01 00:00:00', '2026-12-31 23:59:59', NULL, 10.00);

-- ── SHOWTIMES ──
-- Generate showtimes for all now_showing movies across cinemas
-- Dates: 2025-05-15 to 2025-05-21 (7 days from template)
-- Prices: 2D=75000, 3D=95000, 4DX=120000, IMAX=130000

-- Movie 1: Avengers: Doomsday (formats: 2D, 3D, 4DX, IMAX)
INSERT INTO showtimes (showtime_id, movie_id, auditorium_id, start_time, end_time, is_activate, base_price) VALUES
-- Cinema 1 (Landmark 81)
(1,  1, 1,  '2025-05-15 09:15:00', '2025-05-15 11:43:00', 1, 75000),
(2,  1, 1,  '2025-05-15 14:00:00', '2025-05-15 16:28:00', 1, 75000),
(3,  1, 1,  '2025-05-15 19:00:00', '2025-05-15 21:28:00', 1, 75000),
(4,  1, 2,  '2025-05-15 10:00:00', '2025-05-15 12:28:00', 1, 95000),
(5,  1, 2,  '2025-05-15 16:00:00', '2025-05-15 18:28:00', 1, 95000),
(6,  1, 3,  '2025-05-15 11:00:00', '2025-05-15 13:28:00', 1, 120000),
(7,  1, 3,  '2025-05-15 20:00:00', '2025-05-15 22:28:00', 1, 120000),
(8,  1, 4,  '2025-05-15 12:00:00', '2025-05-15 14:28:00', 1, 130000),
(9,  1, 4,  '2025-05-15 21:00:00', '2025-05-15 23:28:00', 1, 130000),
-- Cinema 2 (Cantavil)
(10, 1, 5,  '2025-05-15 11:30:00', '2025-05-15 13:58:00', 1, 75000),
(11, 1, 5,  '2025-05-15 19:00:00', '2025-05-15 21:28:00', 1, 75000),
(12, 1, 6,  '2025-05-15 13:00:00', '2025-05-15 15:28:00', 1, 95000),
(13, 1, 7,  '2025-05-15 17:00:00', '2025-05-15 19:28:00', 1, 130000),
-- Cinema 3 (Gò Vấp)
(14, 1, 8,  '2025-05-15 09:15:00', '2025-05-15 11:43:00', 1, 75000),
(15, 1, 8,  '2025-05-15 21:30:00', '2025-05-15 23:58:00', 1, 75000),
(16, 1, 9,  '2025-05-15 19:15:00', '2025-05-15 21:43:00', 1, 95000),

-- Movie 2: Mission Impossible 8 (formats: 2D, 3D, IMAX)
-- Cinema 1
(17, 2, 1,  '2025-05-15 09:15:00', '2025-05-15 11:58:00', 1, 75000),
(18, 2, 1,  '2025-05-15 16:45:00', '2025-05-15 19:28:00', 1, 75000),
(19, 2, 2,  '2025-05-15 13:00:00', '2025-05-15 15:43:00', 1, 95000),
(20, 2, 2,  '2025-05-15 22:00:00', '2025-05-16 00:43:00', 1, 95000),
(21, 2, 4,  '2025-05-15 17:00:00', '2025-05-15 19:43:00', 1, 130000),
-- Cinema 4 (Tây Sơn)
(22, 2, 11, '2025-05-15 14:00:00', '2025-05-15 16:43:00', 1, 75000),
(23, 2, 12, '2025-05-15 19:00:00', '2025-05-15 21:43:00', 1, 95000),
-- Cinema 5 (Cầu Giấy)
(24, 2, 13, '2025-05-15 11:30:00', '2025-05-15 14:13:00', 1, 75000),
(25, 2, 15, '2025-05-15 21:00:00', '2025-05-15 23:43:00', 1, 130000),

-- Movie 3: Lilo & Stitch (formats: 2D, 3D)
-- Cinema 1
(26, 3, 1,  '2025-05-16 09:15:00', '2025-05-16 11:03:00', 1, 75000),
(27, 3, 1,  '2025-05-16 14:00:00', '2025-05-16 15:48:00', 1, 75000),
(28, 3, 2,  '2025-05-16 10:00:00', '2025-05-16 11:48:00', 1, 95000),
(29, 3, 2,  '2025-05-16 16:00:00', '2025-05-16 17:48:00', 1, 95000),
-- Cinema 2
(30, 3, 5,  '2025-05-16 11:30:00', '2025-05-16 13:18:00', 1, 75000),
(31, 3, 6,  '2025-05-16 19:15:00', '2025-05-16 21:03:00', 1, 95000),
-- Cinema 3
(32, 3, 8,  '2025-05-16 16:45:00', '2025-05-16 18:33:00', 1, 75000),
(33, 3, 9,  '2025-05-16 13:00:00', '2025-05-16 14:48:00', 1, 95000),

-- Movie 4: Thunderbolts* (formats: 2D, 3D, 4DX)
-- Cinema 1
(34, 4, 1,  '2025-05-16 19:00:00', '2025-05-16 21:07:00', 1, 75000),
(35, 4, 2,  '2025-05-16 19:15:00', '2025-05-16 21:22:00', 1, 95000),
(36, 4, 3,  '2025-05-16 15:30:00', '2025-05-16 17:37:00', 1, 120000),
-- Cinema 3
(37, 4, 8,  '2025-05-16 09:15:00', '2025-05-16 11:22:00', 1, 75000),
(38, 4, 10, '2025-05-16 20:00:00', '2025-05-16 22:07:00', 1, 120000),
-- Cinema 6 (Đà Nẵng)
(39, 4, 16, '2025-05-16 14:00:00', '2025-05-16 16:07:00', 1, 75000),
(40, 4, 17, '2025-05-16 19:00:00', '2025-05-16 21:07:00', 1, 95000),

-- Movie 5: Final Destination: Bloodlines (format: 2D)
-- Cinema 1
(41, 5, 1,  '2025-05-17 21:30:00', '2025-05-17 23:20:00', 1, 75000),
-- Cinema 2
(42, 5, 5,  '2025-05-17 19:00:00', '2025-05-17 20:50:00', 1, 75000),
(43, 5, 5,  '2025-05-17 21:30:00', '2025-05-17 23:20:00', 1, 75000),
-- Cinema 4
(44, 5, 11, '2025-05-17 21:30:00', '2025-05-17 23:20:00', 1, 75000),
-- Cinema 6
(45, 5, 16, '2025-05-17 19:00:00', '2025-05-17 20:50:00', 1, 75000),

-- Additional showtimes on 2025-05-17 for movies 1-4
(46, 1, 1,  '2025-05-17 09:15:00', '2025-05-17 11:43:00', 1, 75000),
(47, 1, 4,  '2025-05-17 12:00:00', '2025-05-17 14:28:00', 1, 130000),
(48, 2, 2,  '2025-05-17 10:00:00', '2025-05-17 12:43:00', 1, 95000),
(49, 3, 1,  '2025-05-17 14:00:00', '2025-05-17 15:48:00', 1, 75000),
(50, 4, 3,  '2025-05-17 11:00:00', '2025-05-17 13:07:00', 1, 120000),

-- Showtimes on 2025-05-18
(51, 1, 1,  '2025-05-18 09:15:00', '2025-05-18 11:43:00', 1, 75000),
(52, 1, 2,  '2025-05-18 16:00:00', '2025-05-18 18:28:00', 1, 95000),
(53, 1, 4,  '2025-05-18 21:00:00', '2025-05-18 23:28:00', 1, 130000),
(54, 2, 1,  '2025-05-18 14:00:00', '2025-05-18 16:43:00', 1, 75000),
(55, 2, 7,  '2025-05-18 17:00:00', '2025-05-18 19:43:00', 1, 130000),
(56, 3, 5,  '2025-05-18 11:30:00', '2025-05-18 13:18:00', 1, 75000),
(57, 4, 8,  '2025-05-18 19:00:00', '2025-05-18 21:07:00', 1, 75000),
(58, 5, 11, '2025-05-18 21:30:00', '2025-05-18 23:20:00', 1, 75000),

-- Showtimes on 2025-05-19
(59, 1, 1,  '2025-05-19 11:30:00', '2025-05-19 13:58:00', 1, 75000),
(60, 1, 3,  '2025-05-19 20:00:00', '2025-05-19 22:28:00', 1, 120000),
(61, 2, 13, '2025-05-19 14:00:00', '2025-05-19 16:43:00', 1, 75000),
(62, 2, 15, '2025-05-19 21:00:00', '2025-05-19 23:43:00', 1, 130000),
(63, 3, 8,  '2025-05-19 09:15:00', '2025-05-19 11:03:00', 1, 75000),
(64, 4, 16, '2025-05-19 19:00:00', '2025-05-19 21:07:00', 1, 75000),
(65, 5, 16, '2025-05-19 21:30:00', '2025-05-19 23:20:00', 1, 75000);

-- ── SAMPLE BOOKINGS ──
INSERT INTO booking (booking_id, movie_id, showtime_id, promotion_id, user_id, booking_time, status, payment_method, total_price) VALUES
(1, 1, 1,  1, 1, '2025-05-14 08:10:00', 'paid',      'momo',   135000),
(2, 1, 8,  2, 1, '2025-05-14 09:00:00', 'paid',      'vnpay',  208000),
(3, 2, 17, NULL, 3, '2025-05-14 10:20:00', 'paid',    'card',   150000),
(4, 3, 26, 3, 3, '2025-05-14 11:30:00', 'paid',       'momo',   127500),
(5, 4, 36, NULL, 1, '2025-05-14 12:15:00', 'paid',    'zalopay', 240000),
(6, 5, 41, NULL, 4, '2025-05-14 13:40:00', 'paid',    'card',   150000),
(7, 1, 10, 1, 4, '2025-05-14 15:00:00', 'paid',       'vnpay',  135000);

-- ── TICKETS ──
INSERT INTO tickets (ticket_id, booking_id, seat_id, price) VALUES
-- Booking 1: 2 standard seats in aud 1 (seats 1,2 = A1,A2)
(1, 1, 1,  75000),
(2, 1, 2,  75000),
-- Booking 2: 2 seats in IMAX aud 4 (seats 289,290 = A1,A2 of aud 4)
(3, 2, 289, 130000),
(4, 2, 290, 130000),
-- Booking 3: 2 standard seats in aud 1 (seats 3,4 = A3,A4)
(5, 3, 3,  75000),
(6, 3, 4,  75000),
-- Booking 4: 2 standard seats in aud 1 (seats 97,98 = A1,A2 of aud 2... recalc)
(7, 4, 97, 75000),
(8, 4, 98, 75000),
-- Booking 5: 2 VIP seats in 4DX aud 3 (seats 245,246 = E1,E2 of aud 3)
(9,  5, 245, 120000),
(10, 5, 246, 120000),
-- Booking 6: 2 standard seats in aud 1 (seats 5,6 = A5,B1)
(11, 6, 5,  75000),
(12, 6, 6,  75000),
-- Booking 7: 2 standard seats in aud 5 (seats 385,386 = A1,A2 of aud 5)
(13, 7, 385, 75000),
(14, 7, 386, 75000);

-- ── PAYMENT TRANSACTIONS ──
INSERT INTO payment_transactions (payment_id, booking_id, transaction_ref, request_id, status, response_code, paid_at, raw_response, amount) VALUES
(1, 1, 'MOMO_TXN_0001',   'REQ_0001', 'success', '00', '2025-05-14 08:11:00', '{"provider":"momo","message":"Success"}',   135000),
(2, 2, 'VNPAY_TXN_0002',  'REQ_0002', 'success', '00', '2025-05-14 09:02:00', '{"provider":"vnpay","message":"Success"}',  208000),
(3, 3, 'CARD_TXN_0003',   'REQ_0003', 'success', '00', '2025-05-14 10:21:00', '{"provider":"card","message":"Success"}',   150000),
(4, 4, 'MOMO_TXN_0004',   'REQ_0004', 'success', '00', '2025-05-14 11:31:00', '{"provider":"momo","message":"Success"}',   127500),
(5, 5, 'ZALOPAY_TXN_0005','REQ_0005', 'success', '00', '2025-05-14 12:16:00', '{"provider":"zalopay","message":"Success"}',240000),
(6, 6, 'CARD_TXN_0006',   'REQ_0006', 'success', '00', '2025-05-14 13:42:00', '{"provider":"card","message":"Success"}',   150000),
(7, 7, 'VNPAY_TXN_0007',  'REQ_0007', 'success', '00', '2025-05-14 15:02:00', '{"provider":"vnpay","message":"Success"}',  135000);
