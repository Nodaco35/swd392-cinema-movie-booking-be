import { Ticket, Booking } from "../models/index.js";

export async function getAllTickets({ booking_id, showtime_id } = {}) {
  const where = {};
  if (booking_id !== undefined) {
    where.booking_id = booking_id;
  }

  const include = [];
  if (showtime_id !== undefined) {
    include.push({ model: Booking, where: { showtime_id }, attributes: [] });
  }

  return Ticket.findAll({
    where: Object.keys(where).length ? where : undefined,
    include,
  });
}

export async function createTicket({ booking_id, seat_id, price }) {
  const booking = await Booking.findByPk(booking_id);
  if (!booking) return { error: "Booking not found", status: 400 };

  const existingTicket = await Ticket.findOne({
    where: { seat_id },
    include: [
      {
        model: Booking,
        required: true,
        where: { showtime_id: booking.showtime_id },
        attributes: [],
      },
    ],
  });

  if (existingTicket) {
    return { error: "Seat already booked for this showtime", status: 409 };
  }

  const ticket = await Ticket.create({ booking_id, seat_id, price });
  return { data: ticket };
}
