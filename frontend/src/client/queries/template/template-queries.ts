import { gql } from "@apollo/client";

export const GET_TEMPLATE_BY_ITS_ID = gql`
  query GetTemplateByItsId($templateId: Float!) {
    getTemplateByItsId(templateId: $templateId) {
      id
      title
      description
      templateNature
      status
      zones {
        id
        moduleType
        content
        size
      }
    }
  }
`;
