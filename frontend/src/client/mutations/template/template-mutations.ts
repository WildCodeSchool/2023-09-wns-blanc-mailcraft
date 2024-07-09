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

export const MODIFY_ZONE_SUBZONES = gql`
  mutation UpdateZoneSubZones(
    $newSubZonesData: [SubZoneInput!]!
    $zoneId: Float!
  ) {
    updateZoneSubZones(newSubZonesData: $newSubZonesData, zoneId: $zoneId)
  }
`;

export const DELETE_TEMPLATE_ZONES = gql`
  mutation DeleteTemplateZones($zonesId: [Float!]!, $templateId: Float!) {
    deleteTemplateZones(zonesId: $zonesId, templateId: $templateId)
  }
`;

export const DELETE_OLD_SUBZONES = gql`
  mutation Mutation($oldSubZonesId: [Float!]!) {
    deleteOldSubZones(oldSubZonesId: $oldSubZonesId)
  }
`;

export const MODIFY_SUBZONE = gql`
  mutation ModifySubZone($subZoneData: SubZoneInput!, $subZoneId: Float!) {
    modifySubZone(subZoneData: $subZoneData, subZoneId: $subZoneId)
  }
`;
