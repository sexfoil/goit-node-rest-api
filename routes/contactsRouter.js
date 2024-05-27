import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, contactsControllers.getAllContacts);

contactsRouter.get(
  "/:contactId",
  authenticate,
  isValidId,
  contactsControllers.getOneContact
);

contactsRouter.delete(
  "/:contactId",
  authenticate,
  isValidId,
  contactsControllers.deleteContact
);

contactsRouter.post(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:contactId",
  authenticate,
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  isEmptyBody,
  validateBody(updateContactStatusSchema),
  contactsControllers.updateStatusContact
);

export default contactsRouter;
