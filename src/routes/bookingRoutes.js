import { Router } from "express";
import { getBookings, getBookingById, createBooking, updateBooking } from "../controllers/bookingController.js";

const router = Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.get("/:id", getBookingById);
router.patch("/:id", updateBooking);

export default router;
