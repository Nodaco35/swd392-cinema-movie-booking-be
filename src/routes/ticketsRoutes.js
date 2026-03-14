import { Router } from "express";
import { Ticket } from "../models/index.js";

const router = Router();

// GET /tickets?showtime_id=<id>
// GET /tickets?booking_id=<id>
router.get("/", async (req, res) => {
  try {
    const { booking_id, showtime_id } = req.query;

    const where = {};
    if (booking_id !== undefined) {
      where.booking_id = booking_id;
    }
    if (showtime_id !== undefined) {
      where.showtime_id = showtime_id;
    }

    const tickets = await Ticket.findAll({
      where: Object.keys(where).length ? where : undefined,
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /tickets
router.post("/", async (req, res) => {
  try {
    const {
      booking_id,
      user_id,
      movie_id,
      showtime_id,
      cinema_id,
      auditorium_id,
      seat_id,
      seat_label,
      price,
    } = req.body;

    // Check for seat conflict: same seat_id and showtime_id
    const existingTicket = await Ticket.findOne({
      where: { showtime_id, seat_id },
    });

    if (existingTicket) {
      return res
        .status(409)
        .json({ message: "Seat already booked for this showtime" });
    }

    const ticket = await Ticket.create({
      booking_id,
      user_id,
      movie_id,
      showtime_id,
      cinema_id,
      auditorium_id,
      seat_id,
      seat_label,
      price,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` });
  }
});

export default router;
