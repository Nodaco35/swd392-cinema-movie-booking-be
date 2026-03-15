import { Router } from "express";
import { getShowtimes, getShowtimeById } from "../controllers/showtimeController.js";

const router = Router();

router.get("/", getShowtimes);
router.get("/:id", getShowtimeById);

export default router;
