import axios from "axios";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useTemplate } from "@/contexts/TemplateContext";
import { IListElement } from "@/types/interfaces/template/template-interfaces";
import { useState, useEffect } from "react";
import imageIconSrc from "@/assets/template-page/icon-image.png";
import logoIconSrc from "@/assets/template-page/lien-de-partage.png";
import texteIconSrc from "@/assets/template-page/icon-texte.png";
import {
  CREATE_TEMPLATE,
  CREATE_ZONE,
  DELETE_TEMPLATE,
} from "@/client/mutations/template/template-mutations";

// Template utils la plupart des fonctions seront stockées ici

export const useTemplateUtils = () => {
  const listElements: IListElement[] = [
    {
      id: "1",
      title: "Texte",
      picture: texteIconSrc,
    },
    {
      id: "2",
      title: "Image",
      picture: imageIconSrc,
    },
    {
      id: "3",
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
    let newTemplateId;
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
              ...(zone.size ? { size: zone.size } : {}),
            },
          },
        });
      });

      await Promise.all(zonePromises);
      console.log("Toutes les zones ont été créées avec succès.");
      // Réinitialiser l'état après la création réussie
      setTemplateId(null);
      resetZones();
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

  const handleResetZones = () => {
    // check d'abord si des zones ont du contenus avant de reset
    if (zones.some((zone) => zone.content)) {
      setIsModalOpen(true);
    } else {
      resetZones();
    }
  };

  const resetZones = () => {
    // l'objet JS,  URL sert à crée des liens pour la preview d'image, à démonter quand il devient obsolète
    setZones([]);
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

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      title: e.target.value,
    }));
  };

  const createHandleFileChange =
    (zoneId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setZones(updatedZones);
    };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    zoneId: string
  ) => {
    const updatedZones = zones.map((zone) => {
      if (zone.id === zoneId) {
        return { ...zone, content: event.target.value };
      }
      return zone;
    });
    setZones(updatedZones);
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

  const removeZone = (zoneId: string) => {
    const newZones = zones.filter((zone) => zone.id !== zoneId);
    setZones(newZones);
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
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onDragEnd = (result: any, listElements: IListElement[]) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    // sert à mettre à jour le type de la zone après le drag N drop, "destination" contient de la donnée sur la zone où l'élément est drop, s'il ya une correspondance avec une zone déjà crée on l'a met à jour.

    const newZones = zones.map((zone) => {
      if (zone.id === destination.droppableId) {
        const droppedElement = listElements.find((el) => el.id === draggableId);
        return {
          ...zone,
          moduleType: droppedElement ? droppedElement.title.toLowerCase() : "",
        };
      }
      return zone;
    });

    setZones(newZones);
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
    closeModal,
    onDragEnd,
    listElements,
  };
};
