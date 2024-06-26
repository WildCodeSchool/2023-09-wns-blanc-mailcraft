import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import DataTemplate from "@/components/DragNDrop/DataTemplate";
import TemplateCreationZone from "@/components/DragNDrop/TemplateCreationZone";
import DroppableArea from "@/components/DragNDrop/DroppableArea";
import TemplateNavBar from "@/components/NavBars/TemplateNavBar";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateUtils } from "@/utils/templateUtils";
import facebookIcon from "@/assets/template-page/social/facebook_145802.png";
import twitterIcon from "@/assets/template-page/social/twitter_152809.png";
import linkedinIcon from "@/assets/template-page/social/linkedin_145807.png";
const TemplatePage = () => {
  const { listElements } = useTemplateUtils();
  const { zones, setZones, template } = useTemplate();
  const [arrayToIterate, setArrayToIterate] = useState(null);
  const [draggingType, setDraggingType] = useState("");

  const socialModule = [
    {
      socialMedia: "Facebook",
      src: facebookIcon,
      link: "https://www.facebook.com/?locale=fr_FR",
    },
    {
      socialMedia: "Twitter",
      src: twitterIcon,
      link: "https://x.com/?lang=fr&mx=2",
    },
    {
      socialMedia: "Linkedin",
      src: linkedinIcon,
      link: "https://fr.linkedin.com/",
    },
  ];

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

  const isMainZone = (id) =>
    id.startsWith("zone-") && !id.includes("-subzone-");
  const isSubZone = (id) => id.includes("-subzone-");

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log("Drag End Result:", result); // Debugging log

    if (!destination) {
      console.warn("Drag ended outside of any droppable area.");
      return;
    }

    // Handle swapping the main zones
    if (
      source.droppableId === "all-zones" &&
      destination.droppableId === "all-zones"
    ) {
      const newZones = Array.from(zones);
      const [removed] = newZones.splice(source.index, 1);
      newZones.splice(destination.index, 0, removed);
      setZones(newZones);
    }

    // Handle swapping subzones within the same main zone
    else if (
      isMainZone(source.droppableId) &&
      isMainZone(destination.droppableId) &&
      isSubZone(draggableId)
    ) {
      const zoneIndex = zones.findIndex(
        (zone) => zone.id === source.droppableId
      );
      const newSubZones = Array.from(zones[zoneIndex].subZones);
      const [removedSubZone] = newSubZones.splice(source.index, 1);
      newSubZones.splice(destination.index, 0, removedSubZone);

      setZones((prevZones) =>
        prevZones.map((zone, idx) =>
          idx === zoneIndex ? { ...zone, subZones: newSubZones } : zone
        )
      );
    }

    // Handle dropping columns into zones which creates subzones
    else if (
      draggableId.startsWith("column-") &&
      isMainZone(destination.droppableId)
    ) {
      const numColumns = parseInt(draggableId.split("-")[1], 10);
      const newSubZones = Array.from({ length: numColumns }, (_, index) => ({
        id: `${destination.droppableId}-subzone-${index}`,
        moduleType: "",
        content: "",
        size: "",
      }));

      setZones((prevZones) =>
        prevZones.map((zone) =>
          zone.id === destination.droppableId
            ? { ...zone, subZones: newSubZones }
            : zone
        )
      );
    }

    // Handle modules being dropped into subzones
    else if (
      isSubZone(destination.droppableId) &&
      draggableId.startsWith("module-")
    ) {
      const moduleType = draggableId.split("-")[1].toLowerCase();
      setZones((prevZones) =>
        prevZones.map((zone) => ({
          ...zone,
          subZones: zone.subZones.map((subZone) => {
            if (subZone.id === destination.droppableId) {
              if (moduleType === "social") {
                const content = socialModule
                  .map((sm) => sm.socialMedia)
                  .join(", ");
                const links = socialModule.map((sm) => sm.link);
                return { ...subZone, moduleType, content, links };
              } else {
                return { ...subZone, moduleType, content: "" };
              }
            } else {
              return subZone;
            }
          }),
        }))
      );
    }

    // setDraggingType("");
  };

  // useEffect(() => {
  //   console.log(`New value for ${draggingType}`);
  // }, [draggingType]);
  return (
    <>
      <TemplateNavBar
        saveButtonColor="#E83B4E"
        saveButtonHoverColor="#BB3241"
        arrayToSave={"template"}
      />
      <section className="w-full h-[90dvh] flex justify-between bg-[#FFEDED] bg-opacity-100 gap-24">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <DataTemplate arrayToIterate={"template"} />
          <TemplateCreationZone
            draggingItemType={draggingType}
            socialModule={socialModule}
          />
          <DroppableArea />
        </DragDropContext>
      </section>
    </>
  );
};

export default TemplatePage;
