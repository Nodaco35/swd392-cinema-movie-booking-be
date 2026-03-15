import { Router } from "express";
import { Seat } from "../models/index.js";

const router = Router();

// GET /seats?auditorium_id=<id>&_sort=row_name,seat_number
router.get("/", async (req, res) => {
  try {
    const { auditorium_id, _sort } = req.query;

    const where = {};
    if (auditorium_id !== undefined) {
      where.auditorium_id = auditorium_id;
    }

    const order = [];
    if (typeof _sort === "string" && _sort.trim().length) {
      const fields = _sort
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      for (const field of fields) {
        order.push([field, "ASC"]);
      }
    }

    const seats = await Seat.findAll({
      where: Object.keys(where).length ? where : undefined,
      order: order.length ? order : undefined,
    });

    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
