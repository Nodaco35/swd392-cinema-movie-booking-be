import { Router } from "express";
import { Op } from "sequelize";
import { Showtime, Auditorium } from "../models/index.js";

const router = Router();

// GET /showtimes?showtime_id=<id>&showtime_id=<id>
// GET /showtimes?movie_id=<id>&start_time_like=<yyyy-mm-dd>
// GET /showtimes?movie_id=<id>
router.get("/", async (req, res) => {
  try {
    const { showtime_id, movie_id, start_time_like } = req.query;

    const where = {};

    if (showtime_id !== undefined) {
      const ids = Array.isArray(showtime_id) ? showtime_id : [showtime_id];
      where.showtime_id = ids;
    }

    if (movie_id !== undefined) {
      where.movie_id = movie_id;
    }

    if (start_time_like !== undefined) {
      // Parse date (yyyy-mm-dd); allow URL-decoded input, e.g. "2026-03-12"
      const dateStr = String(start_time_like).replace(/%/g, "").trim();
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, y, m, d] = match;
        const dayStart = new Date(
          Number(y),
          Number(m) - 1,
          Number(d),
          0,
          0,
          0,
          0,
        );
        const dayEnd = new Date(
          Number(y),
          Number(m) - 1,
          Number(d),
          23,
          59,
          59,
          999,
        );
        where.start_time = { [Op.between]: [dayStart, dayEnd] };
      }
    }

    const showtimes = await Showtime.findAll({
      where,
      include: [
        {
          model: Auditorium,
          attributes: ["auditorium_id", "cinema_id"],
        },
      ],
    });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /showtimes/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
