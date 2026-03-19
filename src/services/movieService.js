import { Movie } from "../models/index.js";

export async function getAllMovies({ movie_id, category, genre, country } = {}) {
  if (movie_id !== undefined) {
    const ids = Array.isArray(movie_id) ? movie_id : [movie_id];
    return Movie.findAll({ where: { movie_id: ids } });
  }

  const where = {};
  if (category === "now_showing") {
    //thêm mới: lọc theo status có trong model/db
    where.status = "now_showing";
  }
  if (category === "coming_soon") {
    //thêm mới: lọc theo status có trong model/db
    where.status = "upcoming";
  }

  let movies = await Movie.findAll({
    where: Object.keys(where).length ? where : undefined,
  });

  //thêm mới: nếu có filter genre/country nhưng DB không có field thì trả rỗng
  if (genre || country) {
    const genreKey = String(genre || "").toLowerCase().trim();
    const countryKey = String(country || "").toLowerCase().trim();
    movies = movies.filter((m) => {
      if (genreKey) {
        const g = String(m.genre || "").toLowerCase();
        if (!g || !g.includes(genreKey)) return false;
      }
      if (countryKey) {
        const c = String(m.country || "").toLowerCase();
        if (!c || !c.includes(countryKey)) return false;
      }
      return true;
    });
  }

  return movies;
}

export async function getMovieById(id) {
  return Movie.findByPk(id);
}
