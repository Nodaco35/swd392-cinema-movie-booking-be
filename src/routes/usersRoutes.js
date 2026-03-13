import { Router } from "express";
import { User } from "../models/index.js";

const router = Router();

// GET /users?email=<email>&password=<password>
router.get("/", async (req, res) => {
  try {
    const { email, password } = req.query;
    let users;

    if (email && password) {
      users = await User.findAll({
        where: { email, password },
      });
    } else if (email) {
      users = await User.findAll({
        where: { email },
      });
    } else {
      users = await User.findAll();
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /users
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// GET /users/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
