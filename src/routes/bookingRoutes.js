import { Router } from "express";
import { Booking } from "../models/index.js";

const router = Router();

// GET /booking?user_id=<id>&_sort=booking_time&_order=desc
router.get("/", async (req, res) => {
  try {
    const { user_id, _sort, _order } = req.query;

    const where = {};
    if (user_id !== undefined) {
      where.user_id = user_id;
    }

    const order = [];
    if (_sort === "booking_time") {
      const direction = _order === "desc" ? "DESC" : "ASC";
      order.push(["booking_time", direction]);
    }

    const bookings = await Booking.findAll({
      where: Object.keys(where).length ? where : undefined,
      order: order.length ? order : undefined,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /booking
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      movie_id,
      showtime_id,
      promotion_id,
      booking_time,
      status,
      payment_method,
      total_price,
    } = req.body;

    const bookingData = {
      user_id,
      movie_id,
      showtime_id,
      promotion_id: promotion_id || null,
      booking_time: booking_time || new Date(),
      status: status || "pending",
      payment_method: payment_method || "cash",
      total_price,
    };
    const booking = await Booking.create(bookingData);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /booking/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH /booking/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, promotion_id } = req.body;

    const [updatedRowsCount] = await Booking.update(
      { status, promotion_id },
      { where: { booking_id: id } },
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updatedBooking = await Booking.findByPk(id);
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
