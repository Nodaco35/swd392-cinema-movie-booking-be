import { Router } from "express";
import { PaymentTransaction } from "../models/index.js";

const router = Router();

// POST /payment_transactions
router.post("/", async (req, res) => {
  try {
    const {
      booking_id,
      user_id,
      amount,
      status,
      method,
      transaction_time,
      reference,
    } = req.body;

    const paymentData = {
      booking_id: booking_id || null,
      user_id,
      amount,
      status,
      method,
      transaction_time: transaction_time || new Date(),
      reference,
    };

    const paymentTransaction = await PaymentTransaction.create(paymentData);
    res.status(201).json(paymentTransaction);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /payment_transactions?booking_id=<id>
router.get("/", async (req, res) => {
  try {
    const { booking_id } = req.query;

    const where = {};
    if (booking_id !== undefined) {
      where.booking_id = booking_id;
    }

    const paymentTransactions = await PaymentTransaction.findAll({
      where: Object.keys(where).length ? where : undefined,
    });

    res.json(paymentTransactions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
