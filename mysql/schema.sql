CREATE DATABASE IF NOT EXISTS cinema_booking;
USE cinema_booking;

CREATE TABLE movies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  genre VARCHAR(100),
  duration_minutes INT,
  rating VARCHAR(20),
  language VARCHAR(50),
  description TEXT,
  poster_url VARCHAR(255),
  release_date DATE
);

CREATE TABLE cinemas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  city VARCHAR(100),
  address VARCHAR(255),
  phone VARCHAR(50)
);

CREATE TABLE auditorium (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cinema_id INT,
  name VARCHAR(100),
  total_seats INT
);

CREATE TABLE seats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  auditorium_id INT,
  row_label VARCHAR(5),
  seat_number INT
);

CREATE TABLE showtimes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  movie_id INT,
  cinema_id INT,
  auditorium_id INT,
  start_time DATETIME,
  end_time DATETIME,
  base_price DECIMAL(10,2)
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(150),
  password VARCHAR(255),
  role VARCHAR(50)
);

CREATE TABLE booking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  movie_id INT,
  showtime_id INT,
  cinema_id INT,
  auditorium_id INT,
  total_amount DECIMAL(10,2),
  status VARCHAR(50),
  promotion_code VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT,
  user_id INT,
  movie_id INT,
  showtime_id INT,
  cinema_id INT,
  auditorium_id INT,
  seat_id VARCHAR(10),
  seat_label VARCHAR(10),
  price DECIMAL(10,2)
);

CREATE TABLE promotion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50),
  description TEXT,
  discount_type VARCHAR(20),
  discount_value DECIMAL(10,2),
  valid_from DATE,
  valid_to DATE,
  is_active BOOLEAN,
  min_amount DECIMAL(10,2)
);

CREATE TABLE payment_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT,
  user_id INT,
  amount DECIMAL(10,2),
  status VARCHAR(50),
  method VARCHAR(50),
  transaction_time DATETIME,
  reference VARCHAR(100)
);
