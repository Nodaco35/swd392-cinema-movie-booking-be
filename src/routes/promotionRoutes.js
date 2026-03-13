import { Router } from "express";
import { Promotion } from "../models/index.js";

const router = Router();

// GET /promotion?code=<code>&is_active=true
router.get("/", async (req, res) => {
  try {
    const { code, is_active } = req.query;

    const where = {};
    if (code !== undefined) {
      where.code = code;
    }
    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    const promotions = await Promotion.findAll({
      where: Object.keys(where).length ? where : undefined,
    });

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
