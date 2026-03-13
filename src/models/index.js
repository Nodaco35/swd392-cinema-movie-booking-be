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

// Associations
// Cinema has many Auditorium
Cinema.hasMany(Auditorium, { foreignKey: "cinema_id" });
Auditorium.belongsTo(Cinema, { foreignKey: "cinema_id" });

// Auditorium has many Seat
Auditorium.hasMany(Seat, { foreignKey: "auditorium_id" });
Seat.belongsTo(Auditorium, { foreignKey: "auditorium_id" });

// Movie has many Showtime
Movie.hasMany(Showtime, { foreignKey: "movie_id" });
Showtime.belongsTo(Movie, { foreignKey: "movie_id" });

// Cinema has many Showtime
Cinema.hasMany(Showtime, { foreignKey: "cinema_id" });
Showtime.belongsTo(Cinema, { foreignKey: "cinema_id" });

// Auditorium has many Showtime
Auditorium.hasMany(Showtime, { foreignKey: "auditorium_id" });
Showtime.belongsTo(Auditorium, { foreignKey: "auditorium_id" });

// User has many Booking
User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });

// Movie has many Booking
Movie.hasMany(Booking, { foreignKey: "movie_id" });
Booking.belongsTo(Movie, { foreignKey: "movie_id" });

// Showtime has many Booking
Showtime.hasMany(Booking, { foreignKey: "showtime_id" });
Booking.belongsTo(Showtime, { foreignKey: "showtime_id" });

// Cinema has many Booking
Cinema.hasMany(Booking, { foreignKey: "cinema_id" });
Booking.belongsTo(Cinema, { foreignKey: "cinema_id" });

// Auditorium has many Booking
Auditorium.hasMany(Booking, { foreignKey: "auditorium_id" });
Booking.belongsTo(Auditorium, { foreignKey: "auditorium_id" });

// Booking has many Ticket
Booking.hasMany(Ticket, { foreignKey: "booking_id" });
Ticket.belongsTo(Booking, { foreignKey: "booking_id" });

// User has many Ticket
User.hasMany(Ticket, { foreignKey: "user_id" });
Ticket.belongsTo(User, { foreignKey: "user_id" });

// Movie has many Ticket
Movie.hasMany(Ticket, { foreignKey: "movie_id" });
Ticket.belongsTo(Movie, { foreignKey: "movie_id" });

// Showtime has many Ticket
Showtime.hasMany(Ticket, { foreignKey: "showtime_id" });
Ticket.belongsTo(Showtime, { foreignKey: "showtime_id" });

// Cinema has many Ticket
Cinema.hasMany(Ticket, { foreignKey: "cinema_id" });
Ticket.belongsTo(Cinema, { foreignKey: "cinema_id" });

// Auditorium has many Ticket
Auditorium.hasMany(Ticket, { foreignKey: "auditorium_id" });
Ticket.belongsTo(Auditorium, { foreignKey: "auditorium_id" });

// Booking has many PaymentTransaction
Booking.hasMany(PaymentTransaction, { foreignKey: "booking_id" });
PaymentTransaction.belongsTo(Booking, { foreignKey: "booking_id" });

// User has many PaymentTransaction
User.hasMany(PaymentTransaction, { foreignKey: "user_id" });
PaymentTransaction.belongsTo(User, { foreignKey: "user_id" });

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
};
