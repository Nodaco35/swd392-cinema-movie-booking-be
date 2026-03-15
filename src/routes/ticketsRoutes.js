import { Router } from "express";
import { Ticket, Booking } from "../models/index.js";

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

    const include = [];
    if (showtime_id !== undefined) {
      include.push({
        model: Booking,
        where: { showtime_id },
        attributes: [],
      });
    }

    const tickets = await Ticket.findAll({
      where: Object.keys(where).length ? where : undefined,
      include,
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /tickets
router.post("/", async (req, res) => {
  try {
    const { booking_id, seat_id, price } = req.body;

    if (!booking_id || !seat_id) {
      return res.status(400).json({ message: "booking_id and seat_id are required" });
    }

    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    // Check for seat conflict: same seat_id and showtime_id via booking
    const existingTicket = await Ticket.findOne({
      where: { seat_id },
      include: [
        {
          model: Booking,
          required: true,
          where: { showtime_id: booking.showtime_id },
          attributes: [],
        },
      ],
    });

    if (existingTicket) {
      return res
        .status(409)
        .json({ message: "Seat already booked for this showtime" });
    }

    const ticket = await Ticket.create({
      booking_id,
      seat_id,
      price,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` });
  }
});

export default router;
