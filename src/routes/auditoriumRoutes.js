import { Router } from "express";
import { getAuditoriums, getAuditoriumById } from "../controllers/auditoriumController.js";

const router = Router();

router.get("/", getAuditoriums);
router.get("/:id", getAuditoriumById);

export default router;
