import { Op } from "sequelize";
import { SeatHold } from "../models/index.js";

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

  if (seat_ids.length > 0) {
    const conflictingHolds = await SeatHold.findAll({
      where: {
        showtime_id,
        seat_id: seat_ids,
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

  for (const seat_id of seat_ids) {
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
