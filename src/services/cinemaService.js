import { Cinema } from "../models/index.js";

export async function getAllCinemas({ cinema_id } = {}) {
  if (cinema_id !== undefined) {
    const ids = Array.isArray(cinema_id) ? cinema_id : [cinema_id];
    return Cinema.findAll({ where: { cinema_id: ids } });
  }
  return Cinema.findAll();
}

export async function getCinemaById(id) {
  return Cinema.findByPk(id);
}
