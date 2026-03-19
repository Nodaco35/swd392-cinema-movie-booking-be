export function validateGetSeatHolds({ showtime_id }) {
  if (!showtime_id) return "showtime_id is required";
  return null;
}

export function validateHoldSeats({ user_id, showtime_id, seat_ids }) {
  if (!user_id || !showtime_id || !Array.isArray(seat_ids)) {
    return "user_id, showtime_id, seat_ids are required";
  }
  //thêm mới: cần chọn ít nhất 1 ghế
  if (seat_ids.length === 0) {
    return "seat_ids must not be empty";
  }
  return null;
}

export function validateReleaseHolds({ user_id, showtime_id }) {
  if (!user_id || !showtime_id) {
    return "user_id and showtime_id are required";
  }
  return null;
}
