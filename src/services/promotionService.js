import { Op } from "sequelize";
import { Promotion } from "../models/index.js";

export async function getActivePromotions({ code } = {}) {
  const now = new Date();
  const where = {
    start_date: { [Op.lte]: now },
    end_date: { [Op.gte]: now },
  };
  if (code !== undefined) {
    where.code = code;
  }
  return Promotion.findAll({ where });
}
