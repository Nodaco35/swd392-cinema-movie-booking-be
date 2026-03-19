import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
} from "../controllers/userController.js";
import { login, register } from "../controllers/authController.js";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);

export default router;
