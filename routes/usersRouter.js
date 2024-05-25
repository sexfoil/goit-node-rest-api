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

export default usersRouter;
