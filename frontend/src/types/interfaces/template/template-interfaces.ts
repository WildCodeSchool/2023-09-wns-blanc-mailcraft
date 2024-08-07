export interface IListElement {
  id: string;
  title: string;
  picture: any;
}

export interface IZone {
  id: string;
  dndId?: string;
  moduleType: string;
  content: any;
  width?: string;
  subZones: ISubZone[];
}

export interface ISubZone {
  id: string;
  dndId?: string;
  moduleType: string;
  content: any;
  width: string;
}

export interface MainZone {
  id: string;
  dndId?: string;
  subZones: IZone[];
}

export interface ModuleProps {
  title: string;
  picture: any;
}

export interface ImgPreviews {
  subZoneId: string;
  imgPreview: string;
}

export type Template = {
  id?: number;
  title?: string;
  description?: string;
  templateNature?: string;
  status?: string;
  userId: number;
  zones?: MainZone[];
};

export type ArrayToIterate = {
  zones: IZone[];
  key: string;
};
