import { Op } from "sequelize";
import { SeatHold, Seat, Ticket, Booking, Showtime } from "../models/index.js";

const HOLD_MINUTES = 10;

export async function expireStaleHolds(showtimeId) {
  await SeatHold.update(
    { status: "expired" },
    {
      where: {
        showtime_id: showtimeId,
        status: "holding",
        hold_until: { [Op.lt]: new Date() },
      },
    },
  );
}

export async function getHeldSeatsByOthers({ showtime_id, exclude_user_id }) {
  await expireStaleHolds(showtime_id);

  const where = { showtime_id: Number(showtime_id), status: "holding" };
  if (exclude_user_id) {
    where.user_id = { [Op.ne]: Number(exclude_user_id) };
  }

  const holds = await SeatHold.findAll({ where });
  return holds.map((h) => h.seat_id);
}

export async function holdSeats({ user_id, showtime_id, seat_ids }) {
  await expireStaleHolds(showtime_id);

  //thêm mới: validate trùng ghế
  const uniqueSeatIds = Array.from(new Set(seat_ids));
  if (uniqueSeatIds.length !== seat_ids.length) {
    return { error: "Duplicate seats selected", status: 400 };
  }

  //thêm mới: validate showtime
  const showtime = await Showtime.findByPk(showtime_id);
  if (!showtime) {
    return { error: "Showtime not found", status: 400 };
  }

  //thêm mới: validate seat thuộc auditorium
  const selectedSeats = await Seat.findAll({
    where: { seat_id: uniqueSeatIds, auditorium_id: showtime.auditorium_id },
  });
  if (selectedSeats.length !== uniqueSeatIds.length) {
    return { error: "Invalid seat selection", status: 400 };
  }

  //thêm mới: kiểm tra SOLD (đã có vé)
  const soldTickets = await Ticket.findAll({
    attributes: ["seat_id"],
    include: [{ model: Booking, attributes: [], where: { showtime_id } }],
    where: { seat_id: uniqueSeatIds },
  });
  const soldSeatIds = soldTickets.map((t) => t.seat_id);
  if (soldSeatIds.length > 0) {
    return {
      error: "Some seats are already sold",
      status: 409,
      conflicting_seat_ids: soldSeatIds,
    };
  }

  if (seat_ids.length > 0) {
    const conflictingHolds = await SeatHold.findAll({
      where: {
        showtime_id,
        seat_id: uniqueSeatIds,
        status: "holding",
        user_id: { [Op.ne]: user_id },
      },
    });

    if (conflictingHolds.length > 0) {
      return {
        error: "Some seats are temporarily held by other users",
        status: 409,
        conflicting_seat_ids: conflictingHolds.map((h) => h.seat_id),
      };
    }
  }

  const holdUntil = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);
  const numUserId = Number(user_id);
  const numShowtimeId = Number(showtime_id);

  await SeatHold.update(
    { status: "released" },
    {
      where: {
        user_id: numUserId,
        showtime_id: numShowtimeId,
        status: "holding",
        ...(seat_ids.length > 0 ? { seat_id: { [Op.notIn]: seat_ids } } : {}),
      },
    },
  );

  if (seat_ids.length === 0) {
    return { success: true, hold_until: null };
  }

  for (const seat_id of uniqueSeatIds) {
    const existing = await SeatHold.findOne({
      where: { showtime_id: numShowtimeId, seat_id },
    });

    if (!existing) {
      await SeatHold.create({
        showtime_id: numShowtimeId,
        seat_id,
        user_id: numUserId,
        hold_until: holdUntil,
        status: "holding",
      });
    } else {
      await existing.update({ user_id: numUserId, hold_until: holdUntil, status: "holding" });
    }
  }

  return { success: true, hold_until: holdUntil };
}

export async function releaseHolds({ user_id, showtime_id }) {
  await SeatHold.update(
    { status: "released" },
    { where: { user_id, showtime_id, status: "holding" } },
  );
  return { success: true };
}
