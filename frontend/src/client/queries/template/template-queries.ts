import { gql } from "@apollo/client";

export const GET_TEMPLATE_BY_ITS_ID = gql`
  query GetTemplateByItsId($templateId: Float!) {
    getTemplateByItsId(templateId: $templateId) {
      id
      title
      description
      templateNature
      creationDate
      status
      userId
      zones {
        id
        order
        subZones {
          id
          order
          moduleType
          content
          width
          links
          zoneId
        }
      }
    }
  }
`;

export const GET_ALL_USER_CREATED_TEMPLATE = gql`
  query GetAllUserCreatedTemplates($userId: Float!) {
    getAllUserCreatedTemplates(userId: $userId) {
      id
      title
      description
      templateNature
      creationDate
      zones {
        id
        order
        subZones {
          id
          order
          moduleType
          content
          width
          links
          zoneId
        }
      }
    }
  }
`;
