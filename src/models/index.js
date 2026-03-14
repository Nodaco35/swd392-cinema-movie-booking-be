import User from "./User.js";
import Movie from "./Movie.js";
import Cinema from "./Cinema.js";
import Auditorium from "./Auditorium.js";
import Seat from "./Seat.js";
import Showtime from "./Showtime.js";
import Booking from "./Booking.js";
import Ticket from "./Ticket.js";
import Promotion from "./Promotion.js";
import PaymentTransaction from "./PaymentTransaction.js";
import SeatHold from "./SeatHold.js";

// Associations
// Cinema has many Auditorium
Cinema.hasMany(Auditorium, { foreignKey: "cinema_id" });
Auditorium.belongsTo(Cinema, { foreignKey: "cinema_id" });

// Cinema has many Promotion
Cinema.hasMany(Promotion, { foreignKey: "cinema_id" });
Promotion.belongsTo(Cinema, { foreignKey: "cinema_id" });

// Auditorium has many Seat
Auditorium.hasMany(Seat, { foreignKey: "auditorium_id" });
Seat.belongsTo(Auditorium, { foreignKey: "auditorium_id" });

// Auditorium has many Showtime
Auditorium.hasMany(Showtime, { foreignKey: "auditorium_id" });
Showtime.belongsTo(Auditorium, { foreignKey: "auditorium_id" });

// Movie has many Showtime
Movie.hasMany(Showtime, { foreignKey: "movie_id" });
Showtime.belongsTo(Movie, { foreignKey: "movie_id" });

// Showtime has many Booking
Showtime.hasMany(Booking, { foreignKey: "showtime_id" });
Booking.belongsTo(Showtime, { foreignKey: "showtime_id" });

// Showtime has many SeatHold
Showtime.hasMany(SeatHold, { foreignKey: "showtime_id" });
SeatHold.belongsTo(Showtime, { foreignKey: "showtime_id" });

// User has many Booking
User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });

// User has many SeatHold
User.hasMany(SeatHold, { foreignKey: "user_id" });
SeatHold.belongsTo(User, { foreignKey: "user_id" });

// Movie has many Booking
Movie.hasMany(Booking, { foreignKey: "movie_id" });
Booking.belongsTo(Movie, { foreignKey: "movie_id" });

// Promotion has many Booking
Promotion.hasMany(Booking, { foreignKey: "promotion_id" });
Booking.belongsTo(Promotion, { foreignKey: "promotion_id" });

// Booking has many Ticket
Booking.hasMany(Ticket, { foreignKey: "booking_id" });
Ticket.belongsTo(Booking, { foreignKey: "booking_id" });

// Booking has many PaymentTransaction
Booking.hasMany(PaymentTransaction, { foreignKey: "booking_id" });
PaymentTransaction.belongsTo(Booking, { foreignKey: "booking_id" });

// Seat has many Ticket
Seat.hasMany(Ticket, { foreignKey: "seat_id" });
Ticket.belongsTo(Seat, { foreignKey: "seat_id" });

// Seat has many SeatHold
Seat.hasMany(SeatHold, { foreignKey: "seat_id" });
SeatHold.belongsTo(Seat, { foreignKey: "seat_id" });

export {
  User,
  Movie,
  Cinema,
  Auditorium,
  Seat,
  Showtime,
  Booking,
  Ticket,
  Promotion,
  PaymentTransaction,
  SeatHold,
};
