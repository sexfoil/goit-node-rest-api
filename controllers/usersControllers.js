import * as usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { PATHS } from "../constants/constants.js";

const AVATAR_PATH = path.resolve("public", "avatars");

const register = async (req, res) => {
  const data = req.body;

  const user = await usersService.findUser({ email: data.email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(data.email);
  const newUser = await usersService.saveUser({ ...data, avatarURL });

  res.status(201).json({
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersService.findUser({ email });
  if (!user) {
    throw HttpError(401, "Invalid email or password");
  }

  const isValidPassword = await compareHash(password, user.password);
  if (!isValidPassword) {
    throw HttpError(401, "Invalid email or password");
  }

  const { _id: id, subscription } = user;
  const token = createToken({ id });
  await usersService.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await usersService.updateUser({ _id }, { token: null });

  res.status(204).json();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await usersService.updateUser({ _id }, { subscription });

  res.json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { path: sourcePath, filename } = req.file;
  const destinationPath = path.join(AVATAR_PATH, filename);
  await saveConvertedImage(sourcePath, destinationPath);
  await fs.unlink(sourcePath);

  const { _id } = req.user;
  const avatarURL = `${req.protocol}://${req.get("host")}/${
    PATHS.AVATAR
  }/${filename}`;
  await usersService.updateUser({ _id }, { avatarURL });

  res.json({
    avatarURL,
  });
};

const saveConvertedImage = async (src, dest) => {
  Jimp.read(src)
    .then((image) => {
      return image.resize(250, 250).write(dest);
    })
    .catch((err) => console.log(err.message));
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};
