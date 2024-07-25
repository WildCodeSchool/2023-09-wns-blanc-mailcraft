import { gql } from "@apollo/client";

export const GET_USER_CONTACTS = gql`
  query GetAllUserContacts($userId: Float!) {
    getAllUserContacts(userId: $userId) {
      id
      email
      profilepic
      firstname
      lastname
    }
  }
`;
