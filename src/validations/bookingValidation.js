export function validateCreateBooking(body) {
  const { user_id, movie_id, showtime_id, total_price } = body;
  if (!user_id || !movie_id || !showtime_id || total_price === undefined) {
    return "user_id, movie_id, showtime_id, and total_price are required";
  }
  return null;
}
