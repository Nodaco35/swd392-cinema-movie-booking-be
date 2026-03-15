import { Router } from "express";
import { Op } from "sequelize";
import { SeatHold } from "../models/index.js";

const router = Router();

const HOLD_MINUTES = 10;

async function expireStaleHolds(showtimeId) {
  await SeatHold.update(
    { status: "expired" },
    {
      where: {
        showtime_id: showtimeId,
        status: "holding",
        hold_until: { [Op.lt]: new Date() },
      },
    },
  );
}

// GET /seat_holds?showtime_id=X&exclude_user_id=Y
// Returns seat_ids currently held by OTHER users (active, not expired)
router.get("/", async (req, res) => {
  try {
    const { showtime_id, exclude_user_id } = req.query;

    if (!showtime_id) {
      return res.status(400).json({ message: "showtime_id is required" });
    }

    await expireStaleHolds(showtime_id);

    const where = { showtime_id: Number(showtime_id), status: "holding" };
    if (exclude_user_id) {
      where.user_id = { [Op.ne]: Number(exclude_user_id) };
    }

    const holds = await SeatHold.findAll({ where });
    res.json(holds.map((h) => h.seat_id));
  } catch (err) {
    console.error("GET /seat_holds error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /seat_holds
// Body: { user_id, showtime_id, seat_ids: number[] }
// Holds the given seats for this user, releases any previous holds of this user
// not in the new seat_ids list. Returns 409 if any seat is held by another user.
router.post("/", async (req, res) => {
  try {
    const { user_id, showtime_id, seat_ids } = req.body;

    if (!user_id || !showtime_id || !Array.isArray(seat_ids)) {
      return res
        .status(400)
        .json({ message: "user_id, showtime_id, seat_ids are required" });
    }

    await expireStaleHolds(showtime_id);

    // Check if any requested seat is currently held by a different user
    if (seat_ids.length > 0) {
      const conflictingHolds = await SeatHold.findAll({
        where: {
          showtime_id,
          seat_id: seat_ids,
          status: "holding",
          user_id: { [Op.ne]: user_id },
        },
      });

      if (conflictingHolds.length > 0) {
        const conflictSeatIds = conflictingHolds.map((h) => h.seat_id);
        return res.status(409).json({
          message: "Some seats are temporarily held by other users",
          conflicting_seat_ids: conflictSeatIds,
        });
      }
    }

    const holdUntil = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);
    const numUserId = Number(user_id);
    const numShowtimeId = Number(showtime_id);

    // Release holds for seats this user no longer has selected
    await SeatHold.update(
      { status: "released" },
      {
        where: {
          user_id: numUserId,
          showtime_id: numShowtimeId,
          status: "holding",
          ...(seat_ids.length > 0
            ? { seat_id: { [Op.notIn]: seat_ids } }
            : {}),
        },
      },
    );

    // If deselecting all, nothing more to do
    if (seat_ids.length === 0) {
      return res.json({ success: true, hold_until: null });
    }

    // Create or refresh holds for each seat.
    // We use findOne + create/update instead of findOrCreate to correctly
    // handle released/expired records from previous users.
    for (const seat_id of seat_ids) {
      const existing = await SeatHold.findOne({
        where: { showtime_id: numShowtimeId, seat_id },
      });

      if (!existing) {
        await SeatHold.create({
          showtime_id: numShowtimeId,
          seat_id,
          user_id: numUserId,
          hold_until: holdUntil,
          status: "holding",
        });
      } else {
        // Update: either same user refreshing, or a stale released/expired record
        await existing.update({
          user_id: numUserId,
          hold_until: holdUntil,
          status: "holding",
        });
      }
    }

    res.json({ success: true, hold_until: holdUntil });
  } catch (err) {
    console.error("POST /seat_holds error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /seat_holds
// Body: { user_id, showtime_id }
// Releases all active holds for this user + showtime
router.delete("/", async (req, res) => {
  try {
    const { user_id, showtime_id } = req.body;

    if (!user_id || !showtime_id) {
      return res
        .status(400)
        .json({ message: "user_id and showtime_id are required" });
    }

    await SeatHold.update(
      { status: "released" },
      { where: { user_id, showtime_id, status: "holding" } },
    );

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /seat_holds error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
