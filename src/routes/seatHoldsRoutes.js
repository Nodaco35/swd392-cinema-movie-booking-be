import { Router } from "express";
import { getSeatHolds, holdSeats, releaseHolds } from "../controllers/seatHoldController.js";

const router = Router();

router.get("/", getSeatHolds);
router.post("/", holdSeats);
router.delete("/", releaseHolds);

export default router;
