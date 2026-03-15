import * as promotionService from "../services/promotionService.js";

export async function getPromotions(req, res) {
  try {
    const promotions = await promotionService.getActivePromotions(req.query);
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
