import * as userService from "../services/userService.js";

export async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
