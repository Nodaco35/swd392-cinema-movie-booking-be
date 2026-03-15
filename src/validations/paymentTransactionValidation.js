export function validateCreatePaymentTransaction(body) {
  const { booking_id, amount } = body;
  if (!booking_id || amount === undefined) {
    return "booking_id and amount are required";
  }
  return null;
}
