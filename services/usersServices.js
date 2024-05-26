import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function findUser(filter) {
  return User.findOne(filter);
}

export async function saveUser(data) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: passwordHash });
}

export async function updateUser(filter, data) {
  return User.findOneAndUpdate(filter, data);
}
