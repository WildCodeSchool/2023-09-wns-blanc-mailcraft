import { Contact } from "../entities/contactList";
import { CreateContactInputs } from "../types/createContactInputs";
import { User } from "../entities/user";
export const addContact = async (
  contactData: CreateContactInputs
): Promise<string> => {
  try {
    const newContact = new Contact();
    newContact.firstname = contactData.firstname;
    newContact.lastname = contactData.lastname || "";
    newContact.email = contactData.email;
    newContact.profilepic =
      contactData.profilepic ||
      "https://res.cloudinary.com/dyhn66mah/image/upload/v1717751432/Mailcraft/uteyoqdcmfedqyepeclt.png";
    newContact.userId = contactData.userId;

    await newContact.save();

    return `New contact created: ${newContact.email}`;
  } catch (error) {
    console.log("Error while creating new contact", error);
    return "No contact created";
  }
};

export const getAllUserContacts = async (
  userId: number
): Promise<Contact[]> => {
  return Contact.find({ where: { userId } });
};

export const deleteContact = async (contactId: number): Promise<string> => {
  try {
    const contactToDelete = await Contact.findOneByOrFail({ id: contactId });
    await contactToDelete.remove();
    return "A contact has been successfully deleted";
  } catch (error) {
    console.error("Error while deleting contact", error);
    return "No contact deleted";
  }
};
