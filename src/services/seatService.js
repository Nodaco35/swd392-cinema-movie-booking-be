import { Seat } from "../models/index.js";

export async function getAllSeats({ auditorium_id, _sort } = {}) {
  const where = {};
  if (auditorium_id !== undefined) {
    where.auditorium_id = auditorium_id;
  }

  const order = [];
  if (typeof _sort === "string" && _sort.trim().length) {
    const fields = _sort.split(",").map((f) => f.trim()).filter(Boolean);
    for (const field of fields) {
      order.push([field, "ASC"]);
    }
  }

  return Seat.findAll({
    where: Object.keys(where).length ? where : undefined,
    order: order.length ? order : undefined,
  });
}
