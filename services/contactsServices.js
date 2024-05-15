import Contact from "../models/Contact.js";

export async function listContacts() {
  return Contact.find();
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
