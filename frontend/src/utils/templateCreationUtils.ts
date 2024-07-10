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
      const templateResponse = await createTemplate({
        variables: {
          templateData: { ...template, status: templateStatus },
        },
      });
      newTemplateId = templateResponse.data.createTemplate.id;

      for (const zone of zones) {
        if (zoneHasNoValue(zone)) {
          continue;
        }
        const { data: zoneResponse } = await createZone({
          variables: { templateId: newTemplateId, zoneOrder: zone.order },
        });
        const newZoneId = zoneResponse.createZone.id;

        for (const subZone of zone.subZones) {
          let subZoneContent = subZone.content;
          if (subZone.moduleType === "image" && subZone.content.length > 0) {
            const formData = new FormData();
            formData.append("file", subZone.content[0]);
            const uploadResponse = await axios.post(
              "http://localhost:5000/template-images-upload",
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            subZoneContent = uploadResponse.data.url;
          }

          await createSubZone({
            variables: {
              subZoneData: {
                order: subZone.order,
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
      alert("Succès");
      console.log(
        "Tous les templates, zones et subzones ont été créés avec succès."
      );
      // resetStateAfterSuccess();
    } catch (error) {
      console.error(
        "Erreur lors de la création du template ou des zones:",
        error
      );
      handleCreationError(newTemplateId);
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
