import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import {
  userSigninSchema,
  userSignupSchema,
  userSubscriptionSchema,
  userEmailSchema,
} from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";
import upload from "../middlewares/upload.js";
import isFileExist from "../middlewares/isFileExist.js";
import { PARAMS } from "../constants/constants.js";

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

usersRouter.get("/current", authenticate, usersControllers.getCurrent);

usersRouter.get("/verify/:verificationToken", usersControllers.verify);

usersRouter.post(
  "/verify",
  isEmptyBody,
  validateBody(userEmailSchema),
  usersControllers.verifyResend
);

usersRouter.post("/logout", authenticate, usersControllers.logout);

usersRouter.patch(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(userSubscriptionSchema),
  usersControllers.updateSubscription
);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single(PARAMS.AVATAR_FILE),
  isFileExist,
  usersControllers.updateAvatar
);

export default usersRouter;
