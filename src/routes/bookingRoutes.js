import { Router } from "express";
import { Booking } from "../models/index.js";

const router = Router();

// GET /booking?user_id=<id>&_sort=created_at&_order=desc
router.get("/", async (req, res) => {
  try {
    const { user_id, _sort, _order } = req.query;

    const where = {};
    if (user_id !== undefined) {
      where.user_id = user_id;
    }

    const order = [];
    if (_sort === "created_at") {
      const direction = _order === "desc" ? "DESC" : "ASC";
      order.push(["created_at", direction]);
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
      cinema_id,
      auditorium_id,
      total_amount,
      status,
      promotion_code,
      created_at,
    } = req.body;

    const bookingData = {
      user_id,
      movie_id,
      showtime_id,
      cinema_id,
      auditorium_id,
      total_amount,
      status,
      promotion_code: promotion_code || null,
      created_at: created_at || new Date(),
    };
    if (bookingData.created_at && typeof bookingData.created_at === 'string') {
      bookingData.created_at = bookingData.created_at.replace(/%/g, '');
    }
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
    const { status, promotion_code } = req.body;

    const [updatedRowsCount] = await Booking.update(
      { status, promotion_code },
      { where: { id } },
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
