import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TemplateModificationZone from "@/components/DragNDrop/TemplateModificationZone";
import DataTemplate from "@/components/DragNDrop/DataTemplate";
import DroppableArea from "@/components/DragNDrop/DroppableArea";
import TemplateNavBar from "@/components/NavBars/TemplateNavBar";
import { useTemplate } from "@/contexts/TemplateContext";
import { GET_TEMPLATE_BY_ITS_ID } from "@/client/queries/template/template-queries";
import facebookIcon from "@/assets/template-page/social/facebook_145802.png";
import twitterIcon from "@/assets/template-page/social/twitter_152809.png";
import linkedinIcon from "@/assets/template-page/social/linkedin_145807.png";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import { useTemplateModificationUtils } from "@/utils/templateModificationUtils";
import {
  templateToHtml,
  downloadHtmlTemplate,
} from "@/utils/templateConversionUtils";
import ProtectedComponent from "@/components/ProtectedComponent";
import SuccessModal from "@/components/SuccessModal";
import { StaticImageData } from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface SocialLink {
  socialMedia: string;
  src: StaticImageData;
  link: string;
}

const TemplateModificationPage = () => {
  const router = useRouter();
  const { template_id } = router.query;
  const {
    templateToModify,
    setTemplateToModify,
    setOldTemplateToModify,
    setOldSubZonesId,
  } = useTemplate();
  const { addZoneSubZonesToDelete } = useTemplateModificationUtils();
  const [draggingType, setDraggingType] = useState("");
  const { useMobileRedirect } = useTemplateCommonUtils();

  function removeTypenames(obj) {
    if (Array.isArray(obj)) {
      return obj.map(removeTypenames);
    } else if (obj !== null && typeof obj === "object") {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key !== "__typename") {
          newObj[key] = removeTypenames(value);
        }
      }
      return newObj;
    }
    return obj;
  }

  const { data, loading, error } = useQuery(GET_TEMPLATE_BY_ITS_ID, {
    variables: { templateId: parseFloat(template_id as string) },
    onCompleted: (data) => {
      if (data && data.getTemplateByItsId) {
        const template = data.getTemplateByItsId;
        const cleanedTemplate = removeTypenames(template);

        // Tri des zones en fonction de la clé order
        const sortedZones = cleanedTemplate.zones.sort(
          (a, b) => a.order - b.order
        );

        // Tri des sous-zones pour chaque zone
        sortedZones.forEach((zone) => {
          if (zone.subZones && zone.subZones.length > 0) {
            zone.subZones.sort((a, b) => a.order - b.order);
          }
        });

        setOldTemplateToModify({ ...cleanedTemplate, zones: sortedZones });
        setTemplateToModify({ ...cleanedTemplate, zones: sortedZones });
      }
    },
  });

  const { user } = useAuth();

  const socialLinks = user?.socialLinks[0] || {};

  const socialModule: SocialLink[] = [];
  if (socialLinks.facebook) {
    socialModule.push({
      socialMedia: "Facebook",
      src: facebookIcon,
      link: socialLinks.facebook,
    });
  }
  if (socialLinks.twitter) {
    socialModule.push({
      socialMedia: "Twitter",
      src: twitterIcon,
      link: socialLinks.twitter,
    });
  }
  if (socialLinks.linkedin) {
    socialModule.push({
      socialMedia: "Linkedin",
      src: linkedinIcon,
      link: socialLinks.linkedin,
    });
  }

  const onDragStart = (start) => {
    const { draggableId } = start;
    if (draggableId.startsWith("module-")) {
      setDraggingType("module");
    } else if (draggableId.startsWith("column-")) {
      setDraggingType("column");
    } else if (
      draggableId.startsWith("zone-") &&
      !draggableId.includes("-subzone-")
    ) {
      setDraggingType("zone");
    } else if (draggableId.includes("-subzone-")) {
      setDraggingType("subZone");
    } else {
      setDraggingType("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      console.warn("Drag ended outside of any droppable area.");
      return;
    }

    const isMainZone = (dndId) =>
      dndId.startsWith("zone-") && !dndId.includes("-subzone-");
    const isSubZone = (dndId) => dndId.includes("-subzone-");

    let newZones = [...templateToModify.zones];

    // Handle swapping the main zones
    if (
      source.droppableId === "all-zones" &&
      destination.droppableId === "all-zones"
    ) {
      const [movedZone] = newZones.splice(source.index, 1);
      newZones.splice(destination.index, 0, movedZone);

      // Maj de l'ordre des zones
      newZones = newZones.map((zone, index) => ({
        ...zone,
        order: index + 1,
      }));
    }
    // Handle swapping subzones within the same main zone
    else if (
      isMainZone(source.droppableId) &&
      source.droppableId === destination.droppableId &&
      isSubZone(draggableId)
    ) {
      const zoneIndex = newZones.findIndex(
        (zone) => zone.dndId === source.droppableId
      );

      const zone = newZones[zoneIndex];
      const newSubZones = Array.from(zone.subZones);
      const [movedSubZone] = newSubZones.splice(source.index, 1);
      newSubZones.splice(destination.index, 0, movedSubZone);

      // Maj de l'ordre des subZones
      const reorderedSubZones = newSubZones.map((subZone, index) => ({
        ...subZone,
        order: index + 1,
      }));

      newZones[zoneIndex] = { ...zone, subZones: reorderedSubZones };
    }
    // Handle dropping columns into zones which creates subzones
    else if (
      draggableId.startsWith("column-") &&
      isMainZone(destination.droppableId)
    ) {
      const zone = templateToModify?.zones?.find(
        (zone) => zone.dndId === destination.droppableId
      );

      if (zone?.subZones.length && zone.subZones.length > 0) {
        const subZoneIdsToDelete = addZoneSubZonesToDelete(zone);
        setOldSubZonesId((prev) => {
          return [...prev, ...subZoneIdsToDelete];
        });
      }

      const numColumns = parseInt(draggableId.split("-")[1], 10);
      const newSubZones = Array.from({ length: numColumns }, (_, idx) => ({
        id: `${destination.droppableId}-subzone-${idx}`,
        dndId: `${destination.droppableId}-subzone-${idx}`,
        order: idx + 1,
        moduleType: "",
        content: "",
        width: "",
      }));

      const zoneIndex = newZones.findIndex(
        (zone) => zone.dndId === destination.droppableId
      );
      newZones[zoneIndex].subZones = newSubZones;
    }
    // Handle modules being dropped into subzones
    else if (
      isSubZone(destination.droppableId) &&
      draggableId.startsWith("module-")
    ) {
      const moduleType = draggableId.split("-")[1].toLowerCase();
      const zoneIndex = newZones.findIndex((zone) =>
        zone.subZones.some((sub) => sub.dndId === destination.droppableId)
      );
      const subZoneIndex = newZones[zoneIndex].subZones.findIndex(
        (sub) => sub.dndId === destination.droppableId
      );
      newZones[zoneIndex].subZones[subZoneIndex] = {
        ...newZones[zoneIndex].subZones[subZoneIndex],
        moduleType: moduleType,
        content:
          moduleType === "social"
            ? socialModule.map((sm) => sm.socialMedia).join(", ")
            : "",
      };
    }

    setTemplateToModify((prev) => ({ ...prev, zones: newZones }));
  };

  useMobileRedirect();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ProtectedComponent>
      <TemplateNavBar
        saveButtonColor="#E83B4E"
        saveButtonHoverColor="#BB3241"
        arrayToIterate={"templateToModify"}
      />
      <SuccessModal message={"Template en cours de modification..."} />
      <section className="w-full h-[90vh] flex justify-between bg-[#766060] gap-24">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <DataTemplate arrayToIterate={"templateToModify"} />
          <TemplateModificationZone
            draggingItemType={draggingType}
            socialModule={socialModule}
          />
          <DroppableArea />
        </DragDropContext>
      </section>
    </ProtectedComponent>
  );
};

export default TemplateModificationPage;
