import * as seatService from "../services/seatService.js";

export async function getSeats(req, res) {
  try {
    const seats = await seatService.getAllSeats(req.query);
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
