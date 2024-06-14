import axios from "axios";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useTemplate } from "@/contexts/TemplateContext";

import {
  IListElement,
  IZone,
  Template,
} from "@/types/interfaces/template/template-interfaces";
import { useState, useEffect } from "react";
import imageIconSrc from "@/assets/template-page/icon-image.png";
import logoIconSrc from "@/assets/template-page/lien-de-partage.png";
import texteIconSrc from "@/assets/template-page/icon-texte.png";
import {
  CREATE_TEMPLATE,
  CREATE_ZONE,
  DELETE_TEMPLATE,
  MODIFY_TEMPLATE,
  MODIFY_TEMPLATE_ZONES,
} from "@/client/mutations/template/template-mutations";
import { useRouter } from "next/router";

// Template utils la plupart des fonctions seront stockées ici

export const useTemplateUtils = () => {
  const router = useRouter();
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
      id: "module-Logo", // en cas de bug remettre 1,2,3
      title: "Logo",
      picture: logoIconSrc,
    },
  ];

  // context
  const {
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
    oldZonesId,
    setOldZonesId,
    isModalModifyOpen,
    setIsModalModifyOpen,
  } = useTemplate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateId, setTemplateId] = useState<number | null>(null);

  const [createTemplate] = useMutation(CREATE_TEMPLATE, {
    onCompleted: (data) => {
      setTemplateId(data.createTemplate.id);
      console.log("Template created with ID:", data.createTemplate.id);
    },
    onError: (error) => {
      console.error("Error creating template:", error);
    },
  });

  const [modifyTemplate] = useMutation(MODIFY_TEMPLATE, {
    onCompleted: (data) => {
      setTemplateId(data.modifyTemplate.id);
      console.log("Template modified with ID:", data.modifyTemplate.id);
    },
    onError: (error) => {
      console.error("Error modifying template:", error);
    },
  });

  const [modifyTemplateZones] = useMutation(MODIFY_TEMPLATE_ZONES, {
    onCompleted: () => {
      console.log("Zone created");
    },
  });

  const [createZone] = useMutation(CREATE_ZONE, {
    onCompleted: () => {
      console.log("Zone created");
    },
  });

  const [deleteTemplate] = useMutation(DELETE_TEMPLATE, {
    onCompleted: () => {
      console.log("Template deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting template:", error);
    },
  });

  const saveTemplate = async (templateStatus: string) => {
    let newTemplateId: Number;
    try {
      // 1e étape crée le template qui va accueilir les zones ensuite, avec le statut passé en argument

      const response = await createTemplate({
        variables: {
          templateData: { ...template, status: templateStatus },
        },
      });

      newTemplateId = response.data.createTemplate.id;

      // Création de chaque zone avec l'id template créé
      const zonePromises = zones.map(async (zone) => {
        let zoneCloudinaryUrl = zone.content;

        if (zone.moduleType === "logo" || zone.moduleType === "image") {
          const formData = new FormData();
          formData.append("file", zone.content[0]);
          const uploadResponse = await axios.post(
            "http://localhost:5000/template-images-upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          zoneCloudinaryUrl = uploadResponse.data.url;
          console.log("Uploaded Image URL:", zoneCloudinaryUrl);
          // on passe le file directement au service d'image qui l'upload et renvoie un url stockable en bdd
        }

        return createZone({
          variables: {
            zoneData: {
              moduleType: zone.moduleType,
              content: zoneCloudinaryUrl,
              templateId: newTemplateId,
              ...(zone.size ? { size: zone.size.toString() } : {}),
            },
          },
        });
      });

      await Promise.all(zonePromises);
      console.log("Toutes les zones ont été créées avec succès.");
      // Réinitialiser l'état après la création réussie
      setTemplateId(null);
      resetZones("zones");
      if (isModalOpen) {
        closeModal();
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création du template ou des zones:",
        error
      );
      // Supprimer le template si une erreur intervient
      if (newTemplateId) {
        try {
          await deleteTemplate({
            variables: {
              templateId: newTemplateId,
            },
          });
          console.log("Template supprimé après erreur.");
          if (isModalOpen) {
            closeModal();
          }
        } catch (deleteError) {
          console.error(
            "Erreur lors de la suppression du template:",
            deleteError
          );
        }
      }
    }
  };

  const saveTemplateToModify = async (template, status: string) => {
    const templateData = {
      title: template.title,
      description: template.description,
      templateNature: template.templateNature,
      status: status,
    };
    try {
      const response = await modifyTemplate({
        variables: {
          templateId: template.id,
          templateData: templateData,
        },
      });

      const newZonesData = await Promise.all(
        template?.zones?.map(async (zone: IZone) => {
          let zoneCloudinaryUrl = zone.content;

          if (
            (zone.moduleType === "logo" || zone.moduleType === "image") &&
            zone.content instanceof FileList &&
            zone.content.length > 0
          ) {
            const formData = new FormData();
            formData.append("file", zone.content[0]);
            console.log(`Zone DATA IS === ${JSON.stringify(zone)}`);

            const uploadResponse = await axios.post(
              "http://localhost:5000/template-images-upload",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            zoneCloudinaryUrl = uploadResponse.data.url;
            console.log("Uploaded Image URL:", zoneCloudinaryUrl);
          }

          return {
            moduleType: zone.moduleType,
            content: zoneCloudinaryUrl,
            size: zone.size,
            templateId: template.id,
          };
        })
      );

      await modifyTemplateZones({
        variables: {
          templateId: template.id,
          newZonesData: newZonesData,
          oldZonesId: oldZonesId,
        },
      });
      resetZones("templateToModify");
      if (isModalOpen) {
        closeModal();
      }
      if (status === "created") {
        router.push("/user/myTemplates").then(() => {
          window.location.reload();
        });
      } else {
        router.push("/user/myTemplatesDrafts").then(() => {
          window.location.reload();
        });
      }

      console.log("Zones have been successfully updated.");
    } catch (error) {
      console.error("Error while updating the template or zones:", error);
    }
  };

  const handleResetZones = (keyToIdentify: string) => {
    if (keyToIdentify === "templateToModify") {
      resetZones(keyToIdentify);
    } else {
      // check d'abord si des zones ont du contenus avant de reset
      if (zones.some((zone) => zone.content)) {
        setIsModalOpen(true);
      } else {
        resetZones("zones");
      }
    }
  };

  const resetZones = (keyToIdentify: string) => {
    // l'objet JS,  URL sert à crée des liens pour la preview d'image, à démonter quand il devient obsolète
    if (keyToIdentify === "templateToModify") {
      if (templateToModify) {
        setTemplateToModify({ ...templateToModify, zones: [] });
      }
    } else {
      setZones([]);
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
    (zoneId: string) =>
    (
      event: React.ChangeEvent<HTMLInputElement>,
      zones: IZone[],
      keyToIdentify: string
    ) => {
      const files = event.target.files;

      // La fonction sert à crée des preview d'images associés à la zone target puis à mettre à jour la zone avec le file image en content, elle vide également imgPreview provenant d'URL si besoin

      if (imgPreviews) {
        const existingPreview = imgPreviews.find(
          (obj) => obj.zoneId === zoneId
        );
        if (existingPreview) {
          URL.revokeObjectURL(existingPreview.imgPreview);
          const updatedPreviews = imgPreviews.filter(
            (obj) => obj.zoneId !== zoneId
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
            { zoneId, imgPreview: newPreviewUrl },
          ]);
        } else {
          setImgPreviews([{ zoneId, imgPreview: newPreviewUrl }]);
        }
      } else {
        setImgPreview(undefined);
      }

      const updatedZones = zones.map((zone) => {
        if (zone.id === zoneId) {
          return { ...zone, content: files };
        }
        return zone;
      });

      if (keyToIdentify === "templateToModify") {
        if (templateToModify !== null) {
          // vérification si non null
          setTemplateToModify({
            ...templateToModify,
            zones: updatedZones,
          });
        } else {
          console.error("templateToModify is null, cannot update zones");
        }
      } else {
        setZones(updatedZones);
      }
    };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    zones: IZone[],
    zoneId: string,
    keyToIdentify: string
  ) => {
    const value = event.target.value;
    const updatedZones = zones.map((zone) => {
      if (zone.id === zoneId) {
        return { ...zone, content: value };
      }
      return zone;
    });

    if (keyToIdentify === "templateToModify") {
      if (templateToModify !== null) {
        // vérification si non null
        setTemplateToModify({
          ...templateToModify,
          zones: updatedZones,
        });
      } else {
        console.error("templateToModify is null, cannot update zones");
      }
    } else {
      setZones(updatedZones);
    }
  };

  const getImgPreviewByZoneId = (zoneId: string, moduleType: string) => {
    let iconSrc;
    if (moduleType === "image") {
      iconSrc = imageIconSrc;
    } else {
      iconSrc = logoIconSrc;
    }
    if (imgPreviews) {
      return (
        imgPreviews.find((zone) => zone.zoneId === zoneId)?.imgPreview ||
        iconSrc
      );
    }
    return iconSrc;
  };
  function getImageSrc(zone: IZone, type: string) {
    console.log(zone);

    if (zone.content instanceof FileList && zone.content.length > 0) {
      const file = zone.content[0];
      return URL.createObjectURL(file);
    }

    return zone.content || getImgPreviewByZoneId(zone.id, type);
  }
  const removeZone = (
    zones: IZone[],
    zoneId: string,
    keyToIdentify: string
  ) => {
    const newZones = zones.filter((zone: IZone) => zone.id !== zoneId);

    if (keyToIdentify === "templateToModify") {
      if (templateToModify) {
        setTemplateToModify((prevTemplate) => {
          if (!prevTemplate) {
            return null;
          }
          return {
            ...prevTemplate,
            zones: newZones,
          };
        });
      } else {
        console.error("templateToModify is null, cannot update zones");
      }
    } else {
      setZones(newZones);
      console.log("Updated zones:", newZones);
    }

    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
      setImgPreview(undefined);
    }

    if (imgPreviews) {
      const existingPreview = imgPreviews.find((obj) => obj.zoneId === zoneId);
      if (existingPreview) {
        URL.revokeObjectURL(existingPreview.imgPreview);
        const updatedPreviews = imgPreviews.filter(
          (obj) => obj.zoneId !== zoneId
        );
        setImgPreviews(
          updatedPreviews.length > 0 ? updatedPreviews : undefined
        );
        console.log("Updated imgPreviews:", updatedPreviews);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModifyModal = () => {
    setIsModalModifyOpen(false);
  };

  return {
    saveTemplate,
    handleResetZones,
    resetZones,
    handleTemplateChange,
    createHandleFileChange,
    handleTextChange,
    getImgPreviewByZoneId,
    removeZone,
    isModalOpen,
    setIsModalOpen,
    isModalModifyOpen,
    setIsModalModifyOpen,
    closeModal,
    closeModifyModal,
    // onDragEnd,
    listElements,
    getImageSrc,
    saveTemplateToModify,
  };
};
