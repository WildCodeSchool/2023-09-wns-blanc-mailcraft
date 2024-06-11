import { Arg, Mutation, Resolver, Query } from "type-graphql";
import { Contact } from "../entities/contactList";
import { CreateContactInputs } from "../types/createContactInputs";
import * as contactService from "../services/contactList.service";

@Resolver(Contact)
export class ContactListResolver {
  @Query(() => [Contact])
  async getAllUserContacts(
    @Arg("userId") userId: number
  ): Promise<Contact[] | string> {
    try {
      const contacts = await contactService.getAllUserContacts(userId);
      return contacts;
    } catch (error) {
      console.error("Error while fetching contacts", error);
      return "No contact fetched";
    }
  }

  @Mutation(() => String)
  async createContact(
    @Arg("contactData") contactData: CreateContactInputs
  ): Promise<string> {
    try {
      return await contactService.addContact(contactData);
    } catch (error) {
      console.error(error);
      return "Error: contact not created";
    }
  }

  @Mutation(() => String)
  async deleteContact(@Arg("contactId") contactId: number): Promise<string> {
    try {
      return await contactService.deleteContact(contactId);
    } catch (error) {
      console.error("Error while deleting contact", error);
      return "No contact has been deleted";
    }
  }
}
