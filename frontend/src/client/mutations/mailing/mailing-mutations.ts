import { gql } from "@apollo/client";

export const ADD_NEW_CONTACT = gql`
  mutation CreateContact($contactData: CreateContactInputs!) {
    createContact(contactData: $contactData)
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($contactId: Float!) {
    deleteContact(contactId: $contactId)
  }
`;
