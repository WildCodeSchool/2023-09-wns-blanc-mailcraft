import { gql } from "@apollo/client";

export const UPDATE_USER_INFORMATION = gql`
  mutation UpdateUser(
    $email: String!
    $firstname: String!
    $lastname: String!
  ) {
    updateUserName(email: $email, firstname: $firstname, lastname: $lastname)
  }
`;

export const VERIFY_PASSWORD = gql`
  mutation VerifyPassword($email: String!, $password: String!) {
    verifyPassword(email: $email, password: $password)
  }
`;

export const CREATE_USER_LINKS = gql`
  mutation CreateUserLinks($socialLinkData: SocialLinkInput!, $email: String!) {
    createUserLinks(socialLinkData: $socialLinkData, email: $email)
  }
`;

export const UPDATE_USER_LINKS = gql`
  mutation UpdateUserLinks(
    $email: String!
    $id: Float!
    $facebook: String!
    $twitter: String!
    $linkedin: String!
  ) {
    updateUserLinks(
      email: $email
      id: $id
      facebook: $facebook
      twitter: $twitter
      linkedin: $linkedin
    )
  }
`;

export const UPDATE_USER_TOUR = gql`
  mutation UpdateUserTour($userId: Float!) {
    updateUserTour(userId: $userId)
  }
`;
