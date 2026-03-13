import { Router } from "express";
import { Movie } from "../models/index.js";

const router = Router();

// GET /movies
// GET /movies?id=<id>&id=<id>
router.get("/", async (req, res) => {
  try {
    const { id } = req.query;

    if (id !== undefined) {
      // Supports single id or multiple ids (e.g. ?id=1&id=2)
      const ids = Array.isArray(id) ? id : [id];
      const movies = await Movie.findAll({
        where: {
          id: ids,
        },
      });
      return res.json(movies);
    }

    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /movies/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
