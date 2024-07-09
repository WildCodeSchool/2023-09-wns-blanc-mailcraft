import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Template,
  IZone,
  ImgPreviews,
} from "@/types/interfaces/template/template-interfaces";

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
  oldTemplateToModify: Template | null;
  setOldTemplateToModify: React.Dispatch<React.SetStateAction<Template | null>>;
  oldSubZonesId: any;
  setOldSubZonesId: React.Dispatch<React.SetStateAction<Number[] | []>>;
  oldZonesId: Number[] | null;
  setOldZonesId: React.Dispatch<React.SetStateAction<Number[] | null>>;
  isModalModifyOpen: boolean;
  setIsModalModifyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [oldTemplateToModify, setOldTemplateToModify] =
    useState<Template | null>(null);
  const [oldSubZonesId, setOldSubZonesId] = useState<Number[] | []>([]);
  const [oldZonesId, setOldZonesId] = useState<Number[] | null>(null);
  const [isModalModifyOpen, setIsModalModifyOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        templateToModify,
        setTemplateToModify,
        oldTemplateToModify,
        setOldTemplateToModify,
        oldSubZonesId,
        setOldSubZonesId,
        oldZonesId,
        setOldZonesId,
        isModalModifyOpen,
        setIsModalModifyOpen,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
