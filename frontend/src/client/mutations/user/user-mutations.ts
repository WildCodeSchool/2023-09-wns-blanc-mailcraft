import { gql } from "@apollo/client";

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
