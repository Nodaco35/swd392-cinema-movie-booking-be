export function validateCreateTicket(body) {
  const { booking_id, seat_id } = body;
  if (!booking_id || !seat_id) {
    return "booking_id and seat_id are required";
  }
  return null;
}
