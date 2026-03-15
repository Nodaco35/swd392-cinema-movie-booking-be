import * as auditoriumService from "../services/auditoriumService.js";

export async function getAuditoriums(req, res) {
  try {
    const auditoriums = await auditoriumService.getAllAuditoriums(req.query);
    res.json(auditoriums);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAuditoriumById(req, res) {
  try {
    const auditorium = await auditoriumService.getAuditoriumById(req.params.id);
    if (!auditorium) return res.status(404).json({ message: "Auditorium not found" });
    res.json(auditorium);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
