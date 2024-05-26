import { gql } from "@apollo/client";

// Déclaration des mutations apollo client pour les templates ici

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($templateData: TemplateInput!) {
    createTemplate(templateData: $templateData) {
      id
    }
  }
`;

export const CREATE_ZONE = gql`
  mutation CreateZone($zoneData: ZoneInput!) {
    createZone(zoneData: $zoneData)
  }
`;

export const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($templateId: Float!) {
    deleteTemplate(templateId: $templateId)
  }
`;
