import * as movieService from "../services/movieService.js";

export async function getMovies(req, res) {
  try {
    const movies = await movieService.getAllMovies(req.query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMovieById(req, res) {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
