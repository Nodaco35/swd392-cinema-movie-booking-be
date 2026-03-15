import * as cinemaService from "../services/cinemaService.js";

export async function getCinemas(req, res) {
  try {
    const cinemas = await cinemaService.getAllCinemas(req.query);
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCinemaById(req, res) {
  try {
    const cinema = await cinemaService.getCinemaById(req.params.id);
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });
    res.json(cinema);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
