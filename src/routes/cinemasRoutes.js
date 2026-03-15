import { Router } from "express";
import { Cinema } from "../models/index.js";

const router = Router();

// GET /cinemas
// GET /cinemas?cinema_id=<id>&cinema_id=<id>
router.get("/", async (req, res) => {
  try {
    const { cinema_id } = req.query;

    if (cinema_id !== undefined) {
      const ids = Array.isArray(cinema_id) ? cinema_id : [cinema_id];
      const cinemas = await Cinema.findAll({
        where: {
          cinema_id: ids,
        },
      });
      return res.json(cinemas);
    }

    const cinemas = await Cinema.findAll();
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /cinemas/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByPk(id);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }
    res.json(cinema);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
