import { Router } from "express";
import { Movie } from "../models/index.js";

const router = Router();

// GET /movies
// GET /movies?movie_id=<id>&movie_id=<id>
router.get("/", async (req, res) => {
  try {
    const { movie_id } = req.query;

    if (movie_id !== undefined) {
      // Supports single id or multiple ids (e.g. ?movie_id=1&movie_id=2)
      const ids = Array.isArray(movie_id) ? movie_id : [movie_id];
      const movies = await Movie.findAll({
        where: {
          movie_id: ids,
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
