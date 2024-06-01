import * as usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import { createToken } from "../helpers/jwt.js";
import { PATHS } from "../constants/constants.js";
import { sendEmail, getVerifyEmailContent } from "../helpers/mailer.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";

const AVATAR_PATH = path.resolve("public", "avatars");

const register = async (req, res) => {
  const data = req.body;

  const user = await usersService.findUser({ email: data.email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(data.email);
  const verificationToken = `${Date.now()}_${nanoid()}`;
  const newUser = await usersService.saveUser({
    ...data,
    avatarURL,
    verificationToken,
  });

  sendVerifyEmail(req, verificationToken);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
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

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
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

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await usersService.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await usersService.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "N/A" }
  );

  res.json({
    message: "Verification successful",
  });
};

const verifyResend = async (req, res) => {
  const { email } = req.body;
  const user = await usersService.findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  sendVerifyEmail(req, user.verificationToken);

  res.json({
    message: "Verification email sent",
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
  const avatarURL = path.join(PATHS.AVATAR, filename);
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

const sendVerifyEmail = async (req, verificationToken) => {
  const emailContent = getVerifyEmailContent(req, verificationToken);
  const mailerMessage = sendEmail(emailContent)
    .then(() => console.log(`Success!`))
    .catch((err) => console.log(`Fail! Cause: ${err.message}`));
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
  verify: controllerWrapper(verify),
  verifyResend: controllerWrapper(verifyResend),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};
