import { gql } from "@apollo/client";

export const GET_ME = gql`
query GetMe {
  getMe {
    lastname
    firstname
    email
  }
}
`;

export const UPDATE_USER = gql`
mutation UpdateUser($email: String!, $firstname: String!, $lastname: String!) {
  updateUserName(email: $email, firstname: $firstname, lastname: $lastname)
}
`;

export const VERIFY_PASSWORD = gql`
mutation VerifyPassword($email: String!, $password: String!) {
  verifyPassword(email: $email, password: $password)
}
`;
