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
          size
          links
          zoneId
        }
        templateId
        subZones {
          id
          content
          links
          moduleType
          size
          zoneId
        }
      }
    }
  }
`;
