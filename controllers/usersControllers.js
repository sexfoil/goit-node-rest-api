import * as usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import { createToken } from "../helpers/jwt.js";

const register = async (req, res) => {
  const data = req.body;
  const user = await usersService.findUser({ email: data.email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await usersService.saveUser(data);
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

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
  updateSubscription: controllerWrapper(updateSubscription),
};
