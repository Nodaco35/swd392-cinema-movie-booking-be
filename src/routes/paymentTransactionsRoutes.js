import { Router } from "express";
import { PaymentTransaction } from "../models/index.js";

const router = Router();

// POST /payment_transactions
router.post("/", async (req, res) => {
  try {
    const {
      booking_id,
      transaction_ref,
      request_id,
      status,
      response_code,
      paid_at,
      raw_response,
      amount,
    } = req.body;

    const paymentData = {
      booking_id,
      transaction_ref,
      request_id,
      status: status || "pending",
      response_code,
      paid_at,
      raw_response,
      amount,
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
