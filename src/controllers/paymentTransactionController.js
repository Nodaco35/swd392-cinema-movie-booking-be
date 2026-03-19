import * as paymentTransactionService from "../services/paymentTransactionService.js";
import { validateCreatePaymentTransaction } from "../validations/paymentTransactionValidation.js";
import { Booking } from "../models/index.js"; //thêm mới

export async function createPaymentTransaction(req, res) {
  const validationError = validateCreatePaymentTransaction(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const booking = await Booking.findByPk(req.body.booking_id); //thêm mới
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" }); //thêm mới
    }
    if (
      req.body.amount !== undefined &&
      Number(req.body.amount) !== Number(booking.total_price)
    ) {
      return res.status(400).json({ message: "Amount mismatch" }); //thêm mới
    }
    const paymentTransaction = await paymentTransactionService.createPaymentTransaction(req.body);
    res.status(201).json(paymentTransaction);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPaymentTransactions(req, res) {
  try {
    const transactions = await paymentTransactionService.getAllPaymentTransactions(req.query);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
