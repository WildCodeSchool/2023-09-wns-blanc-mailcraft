import axios from "axios";
import { useMutation, gql } from "@apollo/client";
import { useTemplate } from "@/contexts/TemplateContext";
import { zoneHasNoValue } from "@/utils/templateCommonFunctions";
import {
  CREATE_TEMPLATE,
  DELETE_TEMPLATE,
} from "@/client/mutations/template/template-mutations";
import { CREATE_ZONE } from "@/client/mutations/template/zone-mutations";
import { CREATE_SUBZONE } from "@/client/mutations/template/subZone-mutations";

export const useTemplateCreationUtils = () => {
  const { zones, template, isModalOpen, setIsModalOpen } = useTemplate();

  const [createTemplate] = useMutation(CREATE_TEMPLATE);
  const [deleteTemplate] = useMutation(DELETE_TEMPLATE);
  const [createZone] = useMutation(CREATE_ZONE);
  const [createSubZone] = useMutation(CREATE_SUBZONE);

  const saveTemplate = async (templateStatus) => {
    let newTemplateId;
    try {
      // Vérification des champs obligatoires
      if (!template.title) {
        setErrorMessage("Le template n'a pas de titre");
        setIsModalErrorOpen(true);
        return;
      }

      // Vérification si les zones ou leurs subzones sont vides
      const areAllZonesEmpty = zones.every(
        (zone) => !zone.subZones || zone.subZones.length === 0
      );

      if (areAllZonesEmpty) {
        setErrorMessage("Le template n'a pas de contenu");
        setIsModalErrorOpen(true);
        return;
      }

      for (const zone of zones) {
        console.log("subzones : ", zones);
        for (const subZone of zone.subZones) {
          if (!subZone.content || subZone.content.length === 0) {
            setErrorMessage("Les zones ne doivent pas être vides");
            setIsModalErrorOpen(true);
            return;
          }
        }
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

      alert("Votre template a été créé avec succès");
      console.log("Succès");
      return true;
      // resetStateAfterSuccess(); à implémenter pour reset les states
    } catch (error) {
      console.error(
        "Erreur lors de la création du template ou des zones:",
        error
      );
      handleCreationError(newTemplateId);
      return false;
    }
  };

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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    saveTemplate,
    handleCreationError,
    closeModal,
  };
};
