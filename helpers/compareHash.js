import bcrypt from "bcrypt";

const compareHash = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash);

export default compareHash;
