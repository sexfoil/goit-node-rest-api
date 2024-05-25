import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import { userSigninSchema, userSignupSchema } from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  usersControllers.register
);

usersRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSigninSchema),
  usersControllers.login
);

usersRouter.get("/current", authenticate, usersControllers.current);

usersRouter.post("/logout", authenticate, usersControllers.logout);

export default usersRouter;
