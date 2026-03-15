import { PaymentTransaction } from "../models/index.js";

export async function createPaymentTransaction(data) {
  const { booking_id, transaction_ref, request_id, status, response_code, paid_at, raw_response, amount } = data;
  return PaymentTransaction.create({
    booking_id,
    transaction_ref,
    request_id,
    status: status || "pending",
    response_code,
    paid_at,
    raw_response,
    amount,
  });
}

export async function getAllPaymentTransactions({ booking_id } = {}) {
  const where = {};
  if (booking_id !== undefined) {
    where.booking_id = booking_id;
  }
  return PaymentTransaction.findAll({
    where: Object.keys(where).length ? where : undefined,
  });
}
