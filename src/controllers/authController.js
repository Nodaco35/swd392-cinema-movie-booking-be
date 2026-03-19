// controllers/authController.js
import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";

// ĐĂNG NHẬP
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Validation: Trường bắt buộc (CR-01 & MSG01)
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        code: "MSG01",
        message: "Email and password are required."
      });
    }

    const user = await userService.checkLogin(email, password);
    
    if (!user) {
      // Sai tài khoản/mật khẩu (MSG11)
      return res.status(401).json({
        status: "error",
        code: "MSG11",
        message: "Invalid username or password."
      });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || "SWD_SECRET_KEY",
      { expiresIn: "24h" }
    );

    res.json({
      status: "success",
      message: "Login successfully.",
      data: {
        token,
        user: {
          id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

// ĐĂNG KÝ (Dùng để kiểm tra validation email tồn tại)
export async function register(req, res) {
  const { full_name, email, password } = req.body;

  try {
    // Validation: Thiếu trường (MSG01)
    if (!full_name || !email || !password) {
      return res.status(400).json({ code: "MSG01", message: "Missing required fields." });
    }

    // Kiểm tra email tồn tại (MSG10)
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        code: "MSG10",
        message: "Email already exists."
      });
    }

    const newUser = await userService.createUser(req.body);
    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: { id: newUser.user_id, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}