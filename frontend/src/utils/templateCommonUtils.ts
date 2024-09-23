import { useTemplate } from "@/contexts/TemplateContext";
import { zoneHasNoValue } from "@/utils/templateCommonFunctions";
import { useEffect, useState } from "react";
import imageIconSrc from "@/assets/template-page/icon-image.png";
import logoIconSrc from "@/assets/template-page/lien-de-partage.png";
import texteIconSrc from "@/assets/template-page/icon-texte.png";
import {
  IListElement,
  IZone,
} from "@/types/interfaces/template/template-interfaces";
import { useRouter } from "next/router";

export const useTemplateCommonUtils = () => {
  const {
    setTemplate,
    setTemplateToModify,
    setZones,
    setImgPreview,
    setImgPreviews,
    setOldZonesId,
    setOldSubZonesId,
    templateToModify,
    zones,
    imgPreview,
    imgPreviews,
    setIsModalErrorOpen,
    isModalOpen,
    setIsModalOpen,
  } = useTemplate();

  const listElements: IListElement[] = [
    {
      id: "module-Texte",
      title: "Texte",
      picture: texteIconSrc,
    },
    {
      id: "module-Image",
      title: "Image",
      picture: imageIconSrc,
    },
    {
      id: "module-Social", // en cas de bug remettre 1,2,3
      title: "Social",
      picture: logoIconSrc,
    },
  ];
  const handleResetZones = (keyToIdentify: string) => {
    if (keyToIdentify === "templateToModify") {
      const oldZonesId =
        templateToModify?.zones
          ?.filter((zone) => typeof zone.id === "number")
          .map((zone) => zone.id) || [];

      setOldZonesId(oldZonesId);
      resetZones(keyToIdentify);
    } else {
      if (
        zones.some((zone) => zone.subZones.some((subZone) => subZone.content))
      ) {
        setIsModalOpen(true);
      } else {
        resetZones("zones");
      }
    }
  };

  const resetZones = (keyToIdentify: string) => {
    if (keyToIdentify === "templateToModify") {
      if (templateToModify) {
        setTemplateToModify({
          ...templateToModify,
          zones: [1, 2, 3].map((number, index) => {
            return {
              id: `temp-zone-${number}`,
              order: index + 1,
              dndId: `zone-${number}`,
              subZones: [],
            };
          }),
        });
      }
    } else {
      setZones([
        { id: "zone-1", order: 1, subZones: [] },
        { id: "zone-2", order: 2, subZones: [] },
        { id: "zone-3", order: 3, subZones: [] },
      ]);
    }

    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
      setImgPreview(undefined);
    }
    if (imgPreviews) {
      imgPreviews.forEach((zone) => URL.revokeObjectURL(zone.imgPreview));
      setImgPreviews(undefined);
    }
    if (isModalOpen) {
      closeModal();
    }
  };

  const handleTemplateChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    label: string,
    keyToIdentify: string
  ) => {
    const newValue = e.target.value;
    if (keyToIdentify === "templateToModify") {
      setTemplateToModify((prevTemplate) => ({
        ...prevTemplate,
        [label]: newValue,
      }));
    } else {
      setTemplate((prevTemplate) => ({
        ...prevTemplate,
        [label]: newValue,
      }));
    }
  };

  const createHandleFileChange =
    (subZoneId: string) =>
    (
      event: React.ChangeEvent<HTMLInputElement>,
      zones: any,
      keyToIdentify: string
    ) => {
      const files = event.target.files;

      if (imgPreviews) {
        const existingPreview = imgPreviews.find(
          (obj) => obj.subZoneId === subZoneId
        );
        if (existingPreview) {
          URL.revokeObjectURL(existingPreview.imgPreview);
          const updatedPreviews = imgPreviews.filter(
            (obj) => obj.subZoneId !== subZoneId
          );
          setImgPreviews(
            updatedPreviews.length > 0 ? updatedPreviews : undefined
          );
        }
      }

      if (files && files[0]) {
        const file = files[0];
        const newPreviewUrl = URL.createObjectURL(file);
        if (imgPreviews) {
          setImgPreviews([
            ...imgPreviews,
            { subZoneId, imgPreview: newPreviewUrl },
          ]);
        } else {
          setImgPreviews([{ subZoneId, imgPreview: newPreviewUrl }]);
        }
      } else {
        setImgPreview(undefined);
      }

      const updatedZones = zones.map((zone) => ({
        ...zone,
        subZones: zone.subZones.map((subZone) => {
          if (subZone.id === subZoneId) {
            return { ...subZone, content: files };
          }
          return subZone;
        }),
      }));

      if (keyToIdentify === "templateToModify") {
        if (templateToModify !== null) {
          setTemplateToModify((prevTemplate) => {
            if (!prevTemplate) {
              return null;
            }
            return {
              ...prevTemplate,
              zones: updatedZones,
            };
          });
        } else {
          console.error("templateToModify is null, cannot update zones");
        }
      } else {
        setZones(updatedZones);
      }
    };

  const handleTextChange = (content, subZoneId, keyToIdentify) => {
    const updateSubZones = (zones, subZoneId, newContent) => {
      return zones.map((zone) => {
        return {
          ...zone,
          subZones: zone.subZones.map((subZone) => {
            if (subZone.id === subZoneId) {
              return { ...subZone, content: newContent };
            }
            return subZone;
          }),
        };
      });
    };

    if (keyToIdentify === "templateToModify") {
      if (templateToModify !== null) {
        const updatedZones = updateSubZones(
          templateToModify.zones,
          subZoneId,
          content
        );

        setTemplateToModify({
          ...templateToModify,
          zones: updatedZones,
        });
      } else {
        console.error("templateToModify is null, cannot update zones");
      }
    } else {
      const updatedZones = updateSubZones(zones, subZoneId, content);
      setZones(updatedZones);
    }
  };

  const getImgPreviewBySubZoneId = (subZoneId: string, moduleType: string) => {
    let iconSrc;
    if (moduleType === "image") {
      iconSrc = imageIconSrc;
    } else {
      iconSrc = logoIconSrc;
    }
    if (imgPreviews) {
      return (
        imgPreviews.find((subZone) => subZone.subZoneId === subZoneId)
          ?.imgPreview || iconSrc
      );
    }
    return iconSrc;
  };

  const getImageSrc = (subZone: IZone, type: string) => {
    if (subZone.content instanceof FileList && subZone.content.length > 0) {
      const file = subZone.content[0];
      return URL.createObjectURL(file);
    }

    return subZone.content || getImgPreviewBySubZoneId(subZone.id, type);
  };

  const removeSubZone = (subZone, subZoneId: string, keyToIdentify: string) => {
    let idToCompare = keyToIdentify === "templateToModify" ? "dndId" : "id";

    const updateZones = (zones) => {
      return zones.map((zone) => {
        const filteredSubZones = zone.subZones.filter(
          (subZone) => subZone[idToCompare] !== subZoneId
        );

        const reorderedSubZones = filteredSubZones.map((subZone, index) => ({
          ...subZone,
          order: index + 1,
        }));

        return { ...zone, subZones: reorderedSubZones };
      });
    };

    if (keyToIdentify === "templateToModify" && templateToModify) {
      setTemplateToModify((prevTemplate) => ({
        ...prevTemplate,
        zones: updateZones(prevTemplate.zones),
      }));
      if (!isTemporarySubZone(subZone)) {
        setOldSubZonesId((prev) => [...prev, subZone.id]);
      }
    } else {
      setZones((prevZones) => updateZones(prevZones));
    }

    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
      setImgPreview(undefined);
    }

    if (imgPreviews) {
      const existingPreview = imgPreviews.find(
        (obj) => obj.subZoneId === subZoneId
      );
      if (existingPreview) {
        URL.revokeObjectURL(existingPreview.imgPreview);
      }
      const updatedPreviews = imgPreviews.filter(
        (obj) => obj.subZoneId !== subZoneId
      );
      setImgPreviews(updatedPreviews.length > 0 ? updatedPreviews : undefined);
    }
  };

  const isTemporarySubZone = (subZone): boolean => {
    return typeof subZone.id === "string";
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsModalErrorOpen(false);
  };

  const useMobileRedirect = () => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      // Fonction pour vérifier la taille de l'écran
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      // Vérifier lors du chargement de la page
      checkIfMobile();

      // Vérifier lorsque la fenêtre est redimensionnée
      window.addEventListener("resize", checkIfMobile);

      // Rediriger si mobile et sur la page concernée
      if (
        isMobile &&
        (router.pathname === "/template/creation" ||
          router.pathname.startsWith("/template/modification"))
      ) {
        router.push("/redirection");
      }

      // Cleanup l'event listener pour éviter les fuites de mémoire
      return () => window.removeEventListener("resize", checkIfMobile);
    }, [isMobile, router]);

    return isMobile;
  };

  return {
    zoneHasNoValue,
    handleResetZones,
    resetZones,
    handleTemplateChange,
    createHandleFileChange,
    handleTextChange,
    getImgPreviewBySubZoneId,
    getImageSrc,
    removeSubZone,
    isTemporarySubZone,
    listElements,
    closeModal,
    closeErrorModal,
    useMobileRedirect,
  };
};
