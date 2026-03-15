import { Router } from "express";
import { createPaymentTransaction, getPaymentTransactions } from "../controllers/paymentTransactionController.js";

const router = Router();

router.post("/", createPaymentTransaction);
router.get("/", getPaymentTransactions);

export default router;
