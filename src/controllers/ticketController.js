import * as ticketService from "../services/ticketService.js";
import { validateCreateTicket } from "../validations/ticketValidation.js";

export async function getTickets(req, res) {
  try {
    const tickets = await ticketService.getAllTickets(req.query);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTicket(req, res) {
  const validationError = validateCreateTicket(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const result = await ticketService.createTicket(req.body);
    if (result.error) return res.status(result.status).json({ message: result.error });
    res.status(201).json(result.data);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` });
  }
}
