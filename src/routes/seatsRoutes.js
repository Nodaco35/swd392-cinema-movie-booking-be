import { Router } from "express";
import { getSeats } from "../controllers/seatController.js";

const router = Router();

router.get("/", getSeats);

export default router;
