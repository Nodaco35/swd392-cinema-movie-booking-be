import { Router } from "express";
import { Op } from "sequelize";
import { Promotion } from "../models/index.js";

const router = Router();

// GET /promotion?code=<code>
router.get("/", async (req, res) => {
  try {
    const { code } = req.query;

    const where = {};
    if (code !== undefined) {
      where.code = code;
    }
    // Check if current date is between start_date and end_date
    const now = new Date();
    where.start_date = { [Op.lte]: now };
    where.end_date = { [Op.gte]: now };

    const promotions = await Promotion.findAll({
      where: Object.keys(where).length ? where : undefined,
    });

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
