import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const filter = { ...query, owner: req.user._id };
  const fields = "-createdAt -updatedAt";
  const settings = {
    skip: (page - 1) * limit,
    limit,
  };

  const contacts = await contactsService.listContacts({
    filter,
    fields,
    settings,
  });
  const total = await contactsService.countContacts(filter);

  res.json({
    total,
    contacts,
  });
};

const getOneContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  validateContactOwner(contact, req.user);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const contactToCheck = await contactsService.getContactById(contactId);
  validateContactOwner(contactToCheck, req.user);

  const contact = await contactsService.removeContact(contactId);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const contact = await contactsService.addContact({ ...req.body, owner });

  res.status(201).json(contact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const contactToCheck = await contactsService.getContactById(contactId);
  validateContactOwner(contactToCheck, req.user);

  const contact = await contactsService.updateContactById(contactId, req.body);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const contactToCheck = await contactsService.getContactById(contactId);
  validateContactOwner(contactToCheck, req.user);

  const contact = await contactsService.updateContactById(contactId, req.body);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

function validateContactOwner(contact, user) {
  const { _id: ownerId } = user;
  if (!ownerId.equals(contact?.owner?._id)) {
    throw HttpError(404);
  }
}

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  deleteContact: controllerWrapper(deleteContact),
  createContact: controllerWrapper(createContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
