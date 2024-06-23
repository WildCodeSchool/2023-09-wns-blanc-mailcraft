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
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log(result);

    if (!destination) {
      console.warn("Drag ended outside of any droppable area.");
      return;
    }

    // Handle dropping columns into zones which creates subzones
    if (
      draggableId.startsWith("column-") &&
      destination.droppableId.startsWith("zone-")
    ) {
      const numColumns = parseInt(draggableId.split("-")[1], 10);
      const newSubZones = Array.from({ length: numColumns }, (_, index) => ({
        id: `${destination.droppableId}-subzone-${index}`,
        moduleType: "",
        content: "",
        size: "",
      }));

      setZones((zones) =>
        zones.map((zone) =>
          zone.id === destination.droppableId
            ? { ...zone, subZones: newSubZones }
            : zone
        )
      );
    }
    // Handle modules being dropped into subzones
    else if (
      destination.droppableId.includes("-subzone-") &&
      draggableId.startsWith("module-")
    ) {
      // alert("SubZone");
      const moduleType = draggableId.split("-")[1].toLowerCase();
      setZones((zones) =>
        zones.map((zone) => ({
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
  };
  // useEffect(() => {
  //   console.log(`New value for template ${JSON.stringify(zones)}`);
  // }, [zones]);
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
