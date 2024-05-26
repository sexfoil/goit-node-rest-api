import Contact from "../models/Contact.js";

export async function listContacts(searchParams) {
  const { filter = {}, fields = {}, settings = {} } = searchParams;
  return Contact.find(filter, fields, settings);
}

export async function countContacts(filter) {
  return Contact.countDocuments(filter);
}

export async function getContactById(id) {
  return Contact.findById(id);
}

export async function removeContact(id) {
  return Contact.findByIdAndDelete(id);
}

export async function addContact(data) {
  return Contact.create(data);
}

export async function updateContactById(id, data) {
  return Contact.findByIdAndUpdate(id, data);
}
