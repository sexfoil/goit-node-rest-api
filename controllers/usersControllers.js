import * as usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const register = async (req, res) => {
  const data = req.body;
  const user = await usersService.findUser({ email: data.email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await usersService.saveUser(data);
  res.status(201).json({
    email: newUser.email,
  });
};

export default {
  register: controllerWrapper(register),
};
