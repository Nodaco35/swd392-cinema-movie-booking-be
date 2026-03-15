import { User } from "../models/index.js";

export async function getAllUsers({ email, password } = {}) {
  if (email && password) {
    return User.findAll({ where: { email, password } });
  }
  if (email) {
    return User.findAll({ where: { email } });
  }
  return User.findAll();
}

export async function getUserById(id) {
  return User.findByPk(id);
}

export async function createUser({ full_name, email, password, phone, role }) {
  return User.create({ full_name, email, password, phone, role });
}
