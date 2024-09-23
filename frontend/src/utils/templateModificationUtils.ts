import axios from "axios";
import { useMutation } from "@apollo/client";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import {
  DELETE_TEMPLATE,
  MODIFY_TEMPLATE,
} from "@/client/mutations/template/template-mutations";
import {
  CREATE_ZONE,
  UPDATE_ZONE,
  DELETE_TEMPLATE_ZONES,
} from "@/client/mutations/template/zone-mutations";
import {
  CREATE_SUBZONE,
  MODIFY_SUBZONE,
  DELETE_OLD_SUBZONES,
} from "@/client/mutations/template/subZone-mutations";
import { useRouter } from "next/router";

export const useTemplateModificationUtils = () => {
  const { zoneHasNoValue, isTemporarySubZone } = useTemplateCommonUtils();

  const {
    templateToModify,
    oldZonesId,
    oldSubZonesId,
    isModalModifyOpen,
    setIsModalModifyOpen,
    setOldSubZonesId,
    isModalErrorOpen,
    setIsModalErrorOpen,
    errorMessage,
    setErrorMessage,
    setCreationGifLoading,
  } = useTemplate();

  const [modifyTemplate] = useMutation(MODIFY_TEMPLATE);
  const [updateZone] = useMutation(UPDATE_ZONE);
  const [createZone] = useMutation(CREATE_ZONE);
  const [deleteTemplateMutation] = useMutation(DELETE_TEMPLATE);
  const [deleteTemplateZones] = useMutation(DELETE_TEMPLATE_ZONES);
  const [createSubZone] = useMutation(CREATE_SUBZONE);
  const [modifySubZone] = useMutation(MODIFY_SUBZONE);
  const [deleteOldSubZones] = useMutation(DELETE_OLD_SUBZONES);

  const router = useRouter();

  const performPreSaveChecks = (template) => {
    // Vérification des champs obligatoires
    if (!template.title) {
      return { success: false, message: "Le template n'a pas de titre" };
    }

    // Vérification si les zones ou leurs subzones sont vides
    const areAllZonesEmpty = template.zones.every(
      (zone) => !zone.subZones || zone.subZones.length === 0
    );

    if (areAllZonesEmpty) {
      return { success: false, message: "Le template n'a pas de contenu" };
    }

    for (const zone of template.zones) {
      for (const subZone of zone.subZones) {
        if (!subZone.content || subZone.content.length === 0) {
          return {
            success: false,
            message: "Les zones ne doivent pas être vides",
          };
        }
      }
    }

    // Toutes les vérifications sont réussies
    return { success: true };
  };

  const saveTemplateToModify = async (template, status) => {
    if (isModalModifyOpen) {
      closeModifyModal();
    }

    const templateData = {
      title: template.title,
      description: template.description,
      templateNature: template.templateNature,
      status: status,
    };

    // Appeler la fonction de vérification
    const checkResult = performPreSaveChecks(template);

    if (!checkResult.success) {
      setErrorMessage(checkResult.message);
      setIsModalErrorOpen(true);
      return;
    }
    setCreationGifLoading(true);
    try {
      await modifyTemplate({
        variables: {
          templateId: template.id,
          templateData: templateData,
        },
      });

      let zonesToDelete = [];

      for (const [index, zone] of template.zones.entries()) {
        let newZoneId = zone.id;

        if (zoneHasNoValue(zone)) {
          if (!isTemporaryZone(zone)) {
            zonesToDelete.push(zone.id);
          }
          continue;
        }

        if (!isTemporaryZone(zone)) {
          await updateZone({
            variables: {
              zoneId: newZoneId,
              zoneOrder: zone.order,
            },
          });
        }

        if (
          zone.id &&
          typeof zone.id === "string" &&
          zone.id.startsWith("temp-zone")
        ) {
          const zoneResponse = await createZone({
            variables: { templateId: template.id, zoneOrder: zone.order },
          });
          newZoneId = zoneResponse.data.createZone.id;
        }

        await handleSubZones(zone, newZoneId);
      }

      if (zonesToDelete.length > 0) {
        await deleteTemplateZones({
          variables: {
            zonesId: zonesToDelete,
            templateId: template.id,
          },
        });
      }

      if (oldZonesId && oldZonesId.length > 0) {
        await deleteTemplateZones({
          variables: {
            zonesId: oldZonesId.flat(),
            templateId: template.id,
          },
        });
      }

      if (oldSubZonesId && oldSubZonesId.length > 0) {
        await deleteOldSubZones({
          variables: {
            oldSubZonesId: oldSubZonesId,
          },
        });
      }

      console.log(JSON.stringify(templateToModify.zones));

      setCreationGifLoading(false);
      console.log("Zones have been successfully updated.");

      // Redirection en fonction du status
      const redirectPath =
        status === "created" ? "/user/myTemplates" : "/user/myTemplatesDrafts";
      router.replace(router.asPath).then(() => {
        router.push(redirectPath);
      });
    } catch (error) {
      console.error(
        "Erreur lors de la modification du template ou des zones:",
        error
      );
    }
  };

  const deleteTemplate = async (templateId: number) => {
    try {
      const { data } = await deleteTemplateMutation({
        variables: { templateId },
      });
      console.log("Template deleted:", data);
    } catch (error) {
      console.error("Error deleting template:", error);
      throw new Error("Failed to delete template.");
    }
  };

  const handleSubZones = async (zone, newZoneId) => {
    for (const subZone of zone.subZones) {
      let subZoneContent = subZone.content;
      if (
        subZone.moduleType === "image" &&
        subZone.content instanceof FileList &&
        subZone.content.length > 0
      ) {
        const formData = new FormData();
        formData.append("file", subZone.content[0]);
        const uploadResponse = await axios.post(
          "http://localhost:5000/template-images-upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        subZoneContent = uploadResponse.data.url;
      }

      const subZoneData = {
        zoneId: newZoneId,
        order: subZone.order,
        moduleType: subZone.moduleType,
        content: subZoneContent,
        width: subZone.width.toString() || "138",
        links: subZone.links,
      };

      if (isTemporarySubZone(subZone)) {
        await createSubZone({ variables: { subZoneData } });
      } else {
        await modifySubZone({
          variables: { subZoneId: subZone.id, subZoneData },
        });
      }
    }
  };

  const isTemporaryZone = (zone): boolean => {
    if (typeof zone.id !== "number" && zone.id.startsWith("temp-zone")) {
      return true;
    }
    return false;
  };

  const addZoneSubZonesToDelete = (zone): number[] => {
    return zone.subZones
      ? zone.subZones
          .filter((subZone) => !isTemporarySubZone(subZone))
          .map((subZone) => subZone.id)
      : [];
  };

  const closeModifyModal = () => {
    setIsModalModifyOpen(false);
  };

  return {
    performPreSaveChecks,
    saveTemplateToModify,
    deleteTemplate,
    handleSubZones,
    closeModifyModal,
    isTemporaryZone,
    addZoneSubZonesToDelete,
  };
};
