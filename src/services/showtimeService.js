import { Op, fn, col } from "sequelize";
import { Showtime, Auditorium, Seat, Ticket, Booking } from "../models/index.js";
import { parseDateRange } from "../helpers/dateHelper.js";

export async function getAllShowtimes({ showtime_id, movie_id, start_time_like } = {}) {
  const where = {};

  if (showtime_id !== undefined) {
    const ids = Array.isArray(showtime_id) ? showtime_id : [showtime_id];
    where.showtime_id = ids;
  }

  if (movie_id !== undefined) {
    where.movie_id = movie_id;
  }

  if (start_time_like !== undefined) {
    const range = parseDateRange(start_time_like);
    if (range) {
      where.start_time = { [Op.between]: [range.start, range.end] };
    }
  }

  const showtimes = await Showtime.findAll({
    where,
    include: [{ model: Auditorium, attributes: ["auditorium_id", "cinema_id"] }],
  });

  //thêm mới: đánh dấu suất chiếu đã hết vé (sold_out)
  if (!showtimes.length) return [];

  const auditoriumIds = Array.from(
    new Set(showtimes.map((s) => s.auditorium_id).filter(Boolean)),
  );
  const showtimeIds = Array.from(
    new Set(showtimes.map((s) => s.showtime_id).filter(Boolean)),
  );

  const seatCounts = await Seat.findAll({
    attributes: ["auditorium_id", [fn("COUNT", col("seat_id")), "seat_count"]],
    where: { auditorium_id: auditoriumIds },
    group: ["auditorium_id"],
    raw: true,
  });
  const seatCountByAud = new Map(
    seatCounts.map((row) => [Number(row.auditorium_id), Number(row.seat_count)]),
  );

  const ticketCounts = await Ticket.findAll({
    attributes: [
      [col("Booking.showtime_id"), "showtime_id"],
      [fn("COUNT", col("ticket_id")), "ticket_count"],
    ],
    include: [{ model: Booking, attributes: [], where: { showtime_id: showtimeIds } }],
    group: ["Booking.showtime_id"],
    raw: true,
  });
  const ticketCountByShowtime = new Map(
    ticketCounts.map((row) => [Number(row.showtime_id), Number(row.ticket_count)]),
  );

  return showtimes.map((s) => {
    const plain = s.get({ plain: true });
    const totalSeats = seatCountByAud.get(plain.auditorium_id) || 0;
    const soldSeats = ticketCountByShowtime.get(plain.showtime_id) || 0;
    return {
      ...plain,
      sold_out: totalSeats > 0 ? soldSeats >= totalSeats : false, //thêm mới
    };
  });
}

export async function getShowtimeById(id) {
  return Showtime.findByPk(id);
}
