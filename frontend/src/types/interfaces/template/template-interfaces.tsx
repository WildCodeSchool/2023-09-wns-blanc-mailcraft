export interface IListElement {
  id: string;
  title: string;
  picture: any;
}

export interface IZone {
  id: string;
  moduleType: string;
  size: string;
  content: any;
  size?: string;
}

export interface ModuleProps {
  title: string;
  picture: any;
}

export interface ImgPreviews {
  zoneId: string;
  imgPreview: string;
}

export type Template = {
  title?: string;
  description?: string;
  templateNature?: string;
  status?: string;
  userId: number;
};
