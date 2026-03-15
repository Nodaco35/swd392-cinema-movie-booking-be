import { Router } from "express";
import { getUsers, getUserById, createUser } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);

export default router;
