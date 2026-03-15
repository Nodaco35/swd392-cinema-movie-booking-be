import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

import healthRoutes from "./routes/healthRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import cinemasRoutes from "./routes/cinemasRoutes.js";
import auditoriumRoutes from "./routes/auditoriumRoutes.js";
import showtimesRoutes from "./routes/showtimesRoutes.js";
import seatsRoutes from "./routes/seatsRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import paymentTransactionsRoutes from "./routes/paymentTransactionsRoutes.js";

export function createApp() {
  const app = express();

  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const durationMs = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${
          res.statusCode
        } (${durationMs}ms)`,
      );
    });
    next();
  });

  app.use(
    cors({
      origin: env.corsOrigin === "*" ? true : env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use(healthRoutes);

  // API contract-compatible mounts (must match json-server paths)
  app.use("/users", usersRoutes);
  app.use("/movies", moviesRoutes);
  app.use("/cinemas", cinemasRoutes);
  app.use("/auditorium", auditoriumRoutes);
  app.use("/showtimes", showtimesRoutes);
  app.use("/seats", seatsRoutes);
  app.use("/tickets", ticketsRoutes);
  app.use("/booking", bookingRoutes);
  app.use("/promotion", promotionRoutes);
  app.use("/payment_transactions", paymentTransactionsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
