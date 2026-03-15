import { Router } from "express";
import { Auditorium } from "../models/index.js";

const router = Router();

// GET /auditorium
// GET /auditorium?auditorium_id=<id>&auditorium_id=<id>
router.get("/", async (req, res) => {
  try {
    const { auditorium_id } = req.query;

    if (auditorium_id !== undefined) {
      const ids = Array.isArray(auditorium_id)
        ? auditorium_id
        : [auditorium_id];
      const auditoriums = await Auditorium.findAll({
        where: {
          auditorium_id: ids,
        },
      });
      return res.json(auditoriums);
    }

    const auditoriums = await Auditorium.findAll();
    res.json(auditoriums);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /auditorium/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const auditorium = await Auditorium.findByPk(id);
    if (!auditorium) {
      return res.status(404).json({ message: "Auditorium not found" });
    }
    res.json(auditorium);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
