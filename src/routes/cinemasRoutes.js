import { Router } from "express";
import { getCinemas, getCinemaById } from "../controllers/cinemaController.js";

const router = Router();

router.get("/", getCinemas);
router.get("/:id", getCinemaById);

export default router;
