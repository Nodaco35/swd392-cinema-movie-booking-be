import { Op } from "sequelize";
import { Showtime, Auditorium } from "../models/index.js";
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

  return Showtime.findAll({
    where,
    include: [{ model: Auditorium, attributes: ["auditorium_id", "cinema_id"] }],
  });
}

export async function getShowtimeById(id) {
  return Showtime.findByPk(id);
}
