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
  CREATE_SUBZONE,
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
      id: "module-Social", // en cas de bug remettre 1,2,3
      title: "Social",
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
    isModalErrorOpen,
    setIsModalErrorOpen,
    errorMessage,
    setErrorMessage
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

  const [
    createZone,
    { data: zoneData, loading: zoneLoading, error: zoneError },
  ] = useMutation(CREATE_ZONE, {
    onCompleted: (data) => {
      console.log("Zone created with ID:", data.createZone.id);
    },
    onError: (error) => {
      console.error("Error creating zone:", error);
    },
  });

  const [
    createSubZone,
    { data: subZoneData, loading: subZoneLoading, error: subZoneError },
  ] = useMutation(CREATE_SUBZONE, {
    onCompleted: (data) => {
      console.log("SubZone created:", data.createSubZone);
    },
    onError: (error) => {
      console.error("Error creating subZone:", error);
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

  const saveTemplate = async (templateStatus) => {
    let newTemplateId;
    try {
      // Vérification des champs obligatoires
      if (
        !template.title ||
        !template.description ||
        !template.templateNature
      ) {
        setErrorMessage("Tous les champs obligatoires doivent être remplis");
        setIsModalErrorOpen(true);
      }
      // Création du template
      const templateResponse = await createTemplate({
        variables: {
          templateData: { ...template, status: templateStatus },
        },
      });
      newTemplateId = templateResponse.data.createTemplate.id;

      // Création des zones et subzones en série pour chaque zone
      for (const zone of zones) {
        const { data: zoneResponse } = await createZone({
          variables: { templateId: newTemplateId },
        });
        const newZoneId = zoneResponse.createZone.id;

        // Gestion de toutes les subzones pour la zone courante
        for (const subZone of zone.subZones) {
          let subZoneContent = subZone.content;
          // Gestion de l'upload d'images si nécessaire
          if (subZone.moduleType === "image") {
            const formData = new FormData();
            formData.append("file", subZone.content[0]);
            const uploadResponse = await axios.post(
              "http://localhost:5000/template-images-upload",
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            subZoneContent = uploadResponse.data.url;
          }

          // Création de la subzone avec le contenu possiblement mis à jour
          await createSubZone({
            variables: {
              subZoneData: {
                moduleType: subZone.moduleType,
                content: subZoneContent,
                size: subZone.size,
                links: subZone.links,
                zoneId: newZoneId,
              },
            },
          });
        }
      }
      alert("succès");
      console.log(
        "Tous les templates, zones et subzones ont été créés avec succès."
      );
      // resetStateAfterSuccess(); à implémenter pour reset les states
    } catch (error) {
      console.error(
        "Erreur lors de la création du template ou des zones:",
        error
      );
      handleCreationError(newTemplateId);
    }
  };

  // Fonction pour gérer l'erreur et nettoyer si nécessaire
  const handleCreationError = async (templateId) => {
    if (templateId) {
      try {
        await deleteTemplate({ variables: { templateId } });
        console.log("Template supprimé après erreur.");
      } catch (deleteError) {
        console.error(
          "Erreur lors de la suppression du template:",
          deleteError
        );
      }
    }
    if (isModalOpen) {
      closeModal();
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
      // Vérification des champs obligatoires
      if (
        !template.title ||
        !template.description ||
        !template.templateNature
      ) {
        throw new Error("Tous les champs obligatoires doivent être remplis");
      }

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
    (subZoneId: string) =>
    (
      event: React.ChangeEvent<HTMLInputElement>,
      zones: any,
      keyToIdentify: string
    ) => {
      const files = event.target.files;

      // La fonction sert à créer des previews d'images associées à la subZone target puis à mettre à jour la subZone avec le fichier image en content, elle vide également imgPreview provenant d'URL si besoin

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
          // Vérification si non null
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
  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    subZones: IZone[],
    subZoneId: string,
    keyToIdentify: string
  ) => {
    const value = event.target.value;

    // Fonction pour mettre à jour les subZones d'une zone spécifique
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
          value
        );

        setTemplateToModify({
          ...templateToModify,
          zones: updatedZones,
        });
      } else {
        console.error("templateToModify is null, cannot update zones");
      }
    } else {
      const updatedZones = updateSubZones(zones, subZoneId, value);
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

  function getImageSrc(subZone: IZone, type: string) {
    console.log(
      `subZone is ########################## ${JSON.stringify(
        subZone
      )} #####################`
    );

    if (subZone.content instanceof FileList && subZone.content.length > 0) {
      const file = subZone.content[0];
      return URL.createObjectURL(file);
    }

    return subZone.content || getImgPreviewBySubZoneId(subZone.id, type);
  }

  const removeSubZone = (subZoneId: string, keyToIdentify: string) => {
    const updateZones = (zones, subZoneId) => {
      return zones.map((zone) => ({
        ...zone,
        subZones: zone.subZones.filter((subZone) => subZone.id !== subZoneId),
      }));
    };

    if (keyToIdentify === "templateToModify") {
      if (templateToModify) {
        setTemplateToModify((prevTemplate) => {
          if (!prevTemplate) {
            return null;
          }
          return {
            ...prevTemplate,
            zones: updateZones(prevTemplate.zones, subZoneId),
          };
        });
      } else {
        console.error("templateToModify is null, cannot update zones");
      }
    } else {
      setZones((prevZones) => updateZones(prevZones, subZoneId));
      console.log("Updated zones:", zones);
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
        const updatedPreviews = imgPreviews.filter(
          (obj) => obj.subZoneId !== subZoneId
        );
        setImgPreviews(
          updatedPreviews.length > 0 ? updatedPreviews : undefined
        );
        // console.log("Updated imgPreviews:", updatedPreviews);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModifyModal = () => {
    setIsModalModifyOpen(false);
  };

  const closeErrorModal = () => {
    setIsModalErrorOpen(false);
  };

  return {
    saveTemplate,
    handleResetZones,
    resetZones,
    handleTemplateChange,
    createHandleFileChange,
    handleTextChange,
    getImgPreviewBySubZoneId,
    removeSubZone,
    isModalOpen,
    setIsModalOpen,
    isModalModifyOpen,
    setIsModalModifyOpen,
    isModalErrorOpen,
    setIsModalErrorOpen,
    closeModal,
    closeModifyModal,
    closeErrorModal,
    // onDragEnd,
    listElements,
    getImageSrc,
    saveTemplateToModify,
  };
};
