import Joi from "joi";

import { EMAIL_REGEXP, SUBSCRIPTIONS } from "../constants/constants.js";

export const userSignupSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
  password: Joi.string().min(6).required(),
});

export const userSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...SUBSCRIPTIONS)
    .required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
});
