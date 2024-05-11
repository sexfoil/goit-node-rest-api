import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();

  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.removeContact(id);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const createContact = async (req, res) => {
  const contact = await contactsService.addContact(req.body);

  res.status(201).json(contact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.updateContactById(id, req.body);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.updateContactById(contactId, req.body);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  deleteContact: controllerWrapper(deleteContact),
  createContact: controllerWrapper(createContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
