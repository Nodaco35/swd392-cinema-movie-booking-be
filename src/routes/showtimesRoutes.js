import { Router } from "express";
import { Op } from "sequelize";
import { Showtime } from "../models/index.js";

const router = Router();

// GET /showtimes?movie_id=<id>&start_time_like=<yyyy-mm-dd>
// GET /showtimes?movie_id=<id>
// GET /showtimes?id=<id>&id=<id>
router.get("/", async (req, res) => {
  try {
    const { id, movie_id, start_time_like } = req.query;

    const where = {};

    if (id !== undefined) {
      const ids = Array.isArray(id) ? id : [id];
      where.id = ids;
    }

    if (movie_id !== undefined) {
      where.movie_id = movie_id;
    }

    if (start_time_like !== undefined) {
      // json-server uses substring matching for _like
      where.start_time = { [Op.like]: `%${start_time_like}%` };
    }

    const showtimes = await Showtime.findAll({ where });
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
