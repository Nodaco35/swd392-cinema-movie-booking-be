import * as showtimeService from "../services/showtimeService.js";

export async function getShowtimes(req, res) {
  try {
    const showtimes = await showtimeService.getAllShowtimes(req.query);
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getShowtimeById(req, res) {
  try {
    const showtime = await showtimeService.getShowtimeById(req.params.id);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
