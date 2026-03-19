import { User } from "../models/index.js";
import bcrypt from "bcryptjs";

export async function getAllUsers({ email, password } = {}) {
  if (email && password) {
    return User.findAll({ where: { email, password } });
  }
  if (email) {
    return User.findAll({ where: { email } });
  }
  return User.findAll();
}

export async function getUserByEmail(email) {
  return User.findOne({ where: { email } });
}

export async function getUserById(id) {
  return User.findByPk(id);
}

export async function createUser({ full_name, email, password, phone, role }) {
  // return User.create({ full_name, email, password, phone, role });

  // Logic hash mật khẩu để đảm bảo an toàn
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return User.create({
    full_name,
    email,
    password: hashedPassword,
    phone,
    role: role || "customer",
  });
}

export async function checkLogin(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
}
