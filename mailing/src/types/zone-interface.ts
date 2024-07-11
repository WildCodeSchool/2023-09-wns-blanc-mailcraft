export interface SubZone {
  id?: number;
  dndId?: string;
  order: number;
  moduleType: string;
  content: string;
  size?: string;
  links?: string[];
  zoneId?: number;
}

export interface TemplateZone {
  id?: number;
  order: number;
  subZones: SubZone[];
  templateId?: number;
  dndId?: string;
}
