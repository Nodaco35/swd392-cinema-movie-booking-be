import * as seatHoldService from "../services/seatHoldService.js";
import {
  validateGetSeatHolds,
  validateHoldSeats,
  validateReleaseHolds,
} from "../validations/seatHoldValidation.js";

export async function getSeatHolds(req, res) {
  const validationError = validateGetSeatHolds(req.query);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const seatIds = await seatHoldService.getHeldSeatsByOthers(req.query);
    res.json(seatIds);
  } catch (err) {
    console.error("GET /seat_holds error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function holdSeats(req, res) {
  const validationError = validateHoldSeats(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const result = await seatHoldService.holdSeats(req.body);
    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
        conflicting_seat_ids: result.conflicting_seat_ids,
      });
    }
    res.json(result);
  } catch (err) {
    console.error("POST /seat_holds error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function releaseHolds(req, res) {
  const validationError = validateReleaseHolds(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const result = await seatHoldService.releaseHolds(req.body);
    res.json(result);
  } catch (err) {
    console.error("DELETE /seat_holds error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
