import { gql } from "@apollo/client";

// Déclaration des mutations apollo client pour les templates ici

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($templateData: TemplateCreationInput!) {
    createTemplate(templateData: $templateData) {
      id
    }
  }
`;

export const CREATE_ZONE = gql`
  mutation CreateZone($templateId: Float!) {
    createZone(templateId: $templateId) {
      id
    }
  }
`;

export const CREATE_SUBZONE = gql`
  mutation CreateSubZone($subZoneData: SubZoneInput!) {
    createSubZone(subZoneData: $subZoneData)
  }
`;

export const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($templateId: Float!) {
    deleteTemplate(templateId: $templateId)
  }
`;

export const MODIFY_TEMPLATE = gql`
  mutation Mutation($templateData: TemplateInput!, $templateId: Float!) {
    modifyTemplate(templateData: $templateData, templateId: $templateId) {
      id
    }
  }
`;

export const MODIFY_TEMPLATE_ZONES = gql`
  mutation updateZonesForTemplate(
    $oldZonesId: [Float!]!
    $newZonesData: [ZoneInput!]!
    $templateId: Float!
  ) {
    updateZonesForTemplate(
      oldZonesId: $oldZonesId
      newZonesData: $newZonesData
      templateId: $templateId
    )
  }
`;
