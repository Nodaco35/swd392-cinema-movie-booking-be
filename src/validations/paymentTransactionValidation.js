export function validateCreatePaymentTransaction(body) {
  const { booking_id, amount, transaction_ref, status } = body;
  if (!booking_id || amount === undefined) {
    return "booking_id and amount are required";
  }
  if (!transaction_ref) {
    return "transaction_ref is required"; //thêm mới
  }
  if (status && !["pending", "success", "failed", "refunded"].includes(status)) {
    return "Invalid payment status"; //thêm mới
  }
  return null;
}
