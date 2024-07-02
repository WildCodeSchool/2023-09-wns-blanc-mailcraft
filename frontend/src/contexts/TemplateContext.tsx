import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Template,
  IZone,
  ImgPreviews,
  IListElement,
} from "@/types/interfaces/template/template-interfaces";
import imageIconSrc from "@/assets/template-page/icon-image.png";
import logoIconSrc from "@/assets/template-page/lien-de-partage.png";
import texteIconSrc from "@/assets/template-page/icon-texte.png";

interface TemplateContextType {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  zones: any;
  setZones: React.Dispatch<React.SetStateAction<any>>;
  imgPreview: string | undefined;
  setImgPreview: React.Dispatch<React.SetStateAction<string | undefined>>;
  imgPreviews: ImgPreviews[] | undefined;
  setImgPreviews: React.Dispatch<
    React.SetStateAction<ImgPreviews[] | undefined>
  >;
  templateToModify: Template | null;
  setTemplateToModify: React.Dispatch<React.SetStateAction<Template | null>>;
  oldZonesId: any;
  setOldZonesId: React.Dispatch<React.SetStateAction<any>>;
  isModalModifyOpen: boolean;
  setIsModalModifyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalErrorOpen: boolean;
  setIsModalErrorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  // listElements: IListElement[];
}

export const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider = ({ children }: TemplateProviderProps) => {
  const [template, setTemplate] = useState<Template>({ userId: 1 });
  const [zones, setZones] = useState<any>([]);
  const [imgPreview, setImgPreview] = useState<string | undefined>(undefined);
  const [imgPreviews, setImgPreviews] = useState<ImgPreviews[] | undefined>(
    undefined
  );
  const [templateToModify, setTemplateToModify] = useState<Template | null>(
    null
  );
  const [oldZonesId, setOldZonesId] = useState<any>(null);
  const [isModalModifyOpen, setIsModalModifyOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // const listElements: IListElement[] = [
  //   {
  //     id: "1",
  //     title: "Texte",
  //     picture: texteIconSrc,
  //   },
  //   {
  //     id: "2",
  //     title: "Image",
  //     picture: imageIconSrc,
  //   },
  //   {
  //     id: "3",
  //     title: "Logo",
  //     picture: logoIconSrc,
  //   },
  // ];

  return (
    <TemplateContext.Provider
      value={{
        template,
        setTemplate,
        zones,
        setZones,
        imgPreview,
        setImgPreview,
        imgPreviews,
        setImgPreviews,
        // listElements,
        templateToModify,
        setTemplateToModify,
        oldZonesId,
        setOldZonesId,
        isModalModifyOpen,
        setIsModalModifyOpen,
        isModalErrorOpen,
        setIsModalErrorOpen,
        errorMessage,
        setErrorMessage
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
