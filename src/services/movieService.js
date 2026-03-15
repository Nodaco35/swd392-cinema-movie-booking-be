import { Movie } from "../models/index.js";

export async function getAllMovies({ movie_id } = {}) {
  if (movie_id !== undefined) {
    const ids = Array.isArray(movie_id) ? movie_id : [movie_id];
    return Movie.findAll({ where: { movie_id: ids } });
  }
  return Movie.findAll();
}

export async function getMovieById(id) {
  return Movie.findByPk(id);
}
