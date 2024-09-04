import { gql } from "@apollo/client";

// Déclaration des mutations apollo client pour les subZones ici

export const CREATE_SUBZONE = gql`
  mutation CreateSubZone($subZoneData: SubZoneInput!) {
    createSubZone(subZoneData: $subZoneData)
  }
`;

export const MODIFY_SUBZONE = gql`
  mutation ModifySubZone($subZoneData: SubZoneInput!, $subZoneId: Float!) {
    modifySubZone(subZoneData: $subZoneData, subZoneId: $subZoneId)
  }
`;

export const DELETE_OLD_SUBZONES = gql`
  mutation DeleteOldSubZones($oldSubZonesId: [Float!]!) {
    deleteOldSubZones(oldSubZonesId: $oldSubZonesId)
  }
`;
