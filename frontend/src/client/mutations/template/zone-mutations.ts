import { gql } from "@apollo/client";

// Déclaration des mutations apollo client pour les zones ici

export const CREATE_ZONE = gql`
  mutation CreateZone($zoneOrder: Float!, $templateId: Float!) {
    createZone(zoneOrder: $zoneOrder, templateId: $templateId) {
      id
    }
  }
`;

export const UPDATE_ZONE = gql`
  mutation UpdateZone($zoneOrder: Float!, $zoneId: Float!) {
    updateZone(zoneOrder: $zoneOrder, zoneId: $zoneId)
  }
`;

export const DELETE_TEMPLATE_ZONES = gql`
  mutation DeleteTemplateZones($zonesId: [Float!]!, $templateId: Float!) {
    deleteTemplateZones(zonesId: $zonesId, templateId: $templateId)
  }
`;
