import { Auditorium } from "../models/index.js";

export async function getAllAuditoriums({ auditorium_id } = {}) {
  if (auditorium_id !== undefined) {
    const ids = Array.isArray(auditorium_id) ? auditorium_id : [auditorium_id];
    return Auditorium.findAll({ where: { auditorium_id: ids } });
  }
  return Auditorium.findAll();
}

export async function getAuditoriumById(id) {
  return Auditorium.findByPk(id);
}
