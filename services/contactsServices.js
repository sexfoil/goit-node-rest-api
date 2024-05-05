import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContactsDB = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  let deleted = null;
  if (index >= 0) {
    deleted = contacts.at(index);
    contacts.splice(index, 1);

    await updateContactsDB(contacts);
  }

  return deleted;
}

export async function addContact(contactData) {
  const newContact = {
    id: nanoid(),
    ...contactData,
  };
  const contacts = await listContacts();
  contacts.push(newContact);

  await updateContactsDB(contacts);

  return newContact;
}

export async function updateContactById(id, contactData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  let updated = null;
  if (index >= 0) {
    updated = { ...contacts[index], ...contactData };
    contacts[index] = updated;
    await updateContactsDB(contacts);
  }

  return updated;
}
