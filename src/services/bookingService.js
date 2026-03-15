import { Booking } from "../models/index.js";

export async function getAllBookings({ user_id, _sort, _order } = {}) {
  const where = {};
  if (user_id !== undefined) {
    where.user_id = user_id;
  }

  const order = [];
  if (_sort === "booking_time") {
    const direction = _order === "desc" ? "DESC" : "ASC";
    order.push(["booking_time", direction]);
  }

  return Booking.findAll({
    where: Object.keys(where).length ? where : undefined,
    order: order.length ? order : undefined,
  });
}

export async function getBookingById(id) {
  return Booking.findByPk(id);
}

export async function createBooking(data) {
  const { user_id, movie_id, showtime_id, promotion_id, booking_time, status, payment_method, total_price } = data;
  return Booking.create({
    user_id,
    movie_id,
    showtime_id,
    promotion_id: promotion_id || null,
    booking_time: booking_time || new Date(),
    status: status || "pending",
    payment_method: payment_method || "cash",
    total_price,
  });
}

export async function updateBooking(id, { status, promotion_id }) {
  const [updatedRowsCount] = await Booking.update(
    { status, promotion_id },
    { where: { booking_id: id } },
  );
  if (updatedRowsCount === 0) return null;
  return Booking.findByPk(id);
}
