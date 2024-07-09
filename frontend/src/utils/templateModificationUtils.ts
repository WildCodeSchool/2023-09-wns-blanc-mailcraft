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
  DELETE_OLD_SUBZONES,
  MODIFY_TEMPLATE,
  MODIFY_ZONE_SUBZONES,
  DELETE_TEMPLATE_ZONES,
  MODIFY_SUBZONE,
  UPDATE_ZONE,
} from "@/client/mutations/template/template-mutations";
import { useRouter } from "next/router";

export const useTemplateModificationUtils = () => {
  const saveTemplateToModify = async (template, status) => {
    const templateData = {
      title: template.title,
      description: template.description,
      templateNature: template.templateNature,
      status: status,
    };

    try {
      await modifyTemplate({
        variables: {
          templateId: template.id,
          templateData: templateData,
        },
      });

      // Traiter chaque zone et ses sous-zones
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
        // Création de zone si nécessaire
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

        handleSubZones(zone, newZoneId);
      }

      // case si zone a été vidée de ses subZones
      if (zonesToDelete.length > 0) {
        await deleteTemplateZones({
          variables: {
            zonesId: zonesToDelete,
            templateId: template.id,
          },
        });
      }

      // case si clear Zones a été utilisé
      if (oldZonesId && oldZonesId.length > 0) {
        await deleteTemplateZones({
          variables: {
            zonesId: oldZonesId.flat(),
            templateId: template.id,
          },
        });
      }

      // case si des subZones ont été supprimé par le bouton ou un dragNdrop
      if (oldSubZonesId && oldSubZonesId.length > 0) {
        await deleteOldSubZones({
          variables: {
            oldSubZonesId: oldSubZonesId,
          },
        });
      }

      console.log(JSON.stringify(templateToModify.zones));

      if (isModalModifyOpen) {
        closeModifyModal();
      }
      // if (status === "created") {
      //   router.push("/user/myTemplates").then(() => {
      //     window.location.reload();
      //   });
      // } else if (status === "draft") {
      //   router.push("/user/myTemplatesDrafts").then(() => {
      //     window.location.reload();
      //   });
      // }

      console.log("Zones have been successfully updated.");
    } catch (error) {
      console.error("Error while updating the template or zones:", error);
      console.log(error.stack);
      // Potentiel gestion des erreurs ou rollback ici
    }
  };
};
