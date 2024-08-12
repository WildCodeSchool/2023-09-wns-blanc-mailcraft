import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import DataTemplate from "@/components/DragNDrop/DataTemplate";
import TemplateCreationZone from "@/components/DragNDrop/TemplateCreationZone";
import DroppableArea from "@/components/DragNDrop/DroppableArea";
import TemplateNavBar from "@/components/NavBars/TemplateNavBar";
import { useTemplate } from "@/contexts/TemplateContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import facebookIcon from "@/assets/template-page/social/facebook_145802.png";
import twitterIcon from "@/assets/template-page/social/twitter_152809.png";
import linkedinIcon from "@/assets/template-page/social/linkedin_145807.png";
import ProtectedComponent from "@/components/ProtectedComponent";
import { StaticImageData } from "next/image";
import SuccessModal from "@/components/SuccessModal";
interface SocialLink {
  socialMedia: string;
  src: StaticImageData;
  link: string;
}

const TemplatePage = () => {
  const {
    zones,
    setZones,
    template,
    setTemplate,
    setIsModalOpen,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
  } = useTemplate();
  const [draggingType, setDraggingType] = useState("");
  const { user, loading, error } = useAuth();

  const socialLinks = user?.socialLinks[0] || {};
  const router = useRouter();
  useEffect(() => {
    if (user && user.id) {
      setIsModalOpen(false);
      setTemplate({ userId: user.id });
      setZones([]);
    }
  }, [user, setTemplate, setZones]);

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

  const isMainZone = (id) =>
    id.startsWith("zone-") && !id.includes("-subzone-");
  const isSubZone = (id) => id.includes("-subzone-");

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log("Drag End Result:", result);

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
      const reorderedZones = newZones.map((zone, index) => ({
        ...zone,
        order: index + 1,
      }));
      setZones(reorderedZones);
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
      // Update the order of subZones
      const reorderedSubZones = newSubZones.map((subZone, index) => ({
        ...subZone,
        order: index + 1,
      }));
      setZones((prevZones) =>
        prevZones.map((zone, idx) =>
          idx === zoneIndex ? { ...zone, subZones: reorderedSubZones } : zone
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
        order: index + 1,
        moduleType: "",
        content: "",
        width: "",
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

  return (
    <ProtectedComponent>
      <TemplateNavBar
        saveButtonColor="#E83B4E"
        saveButtonHoverColor="#BB3241"
        arrayToSave={"template"}
      />
      <SuccessModal message={"Template en cours de création..."} />
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
    </ProtectedComponent>
  );
};

export default TemplatePage;
