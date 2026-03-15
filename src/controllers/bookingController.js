import * as bookingService from "../services/bookingService.js";
import { validateCreateBooking } from "../validations/bookingValidation.js";

export async function getBookings(req, res) {
  try {
    const bookings = await bookingService.getAllBookings(req.query);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBooking(req, res) {
  const validationError = validateCreateBooking(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateBooking(req, res) {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
