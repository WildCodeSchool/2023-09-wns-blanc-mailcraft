import { gql, useMutation } from "@apollo/client";

// Déclaration des mutations apollo client pour les templates ici

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($templateData: TemplateCreationInput!) {
    createTemplate(templateData: $templateData) {
      id
    }
  }
`;

export const MODIFY_TEMPLATE = gql`
  mutation Mutation($templateData: TemplateInput!, $templateId: Float!) {
    modifyTemplate(templateData: $templateData, templateId: $templateId) {
      id
    }
  }
`;

export const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($templateId: Float!) {
    deleteTemplate(templateId: $templateId)
  }
`;
