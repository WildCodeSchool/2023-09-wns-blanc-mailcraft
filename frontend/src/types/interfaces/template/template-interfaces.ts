export interface IListElement {
  id: string;
  title: string;
  picture: any;
}

export interface IZone {
  id: string;
  moduleType: string;
  content: any;
  size?: string;
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
  zones?: IZone[];
};

export type ArrayToIterate = {
  zones: IZone[];
  key: string;
};
