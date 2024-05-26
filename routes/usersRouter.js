import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import {
  userSigninSchema,
  userSignupSchema,
  userSubscriptionSchema,
} from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";
import upload from "../middlewares/upload.js";

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
  upload.single("avatar"),
  usersControllers.updateAvatar
);

export default usersRouter;
