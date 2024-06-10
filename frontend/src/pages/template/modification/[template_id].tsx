import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateUtils } from "@/utils/templateUtils";
import { GET_TEMPLATE_BY_ITS_ID } from "@/client/queries/template/template-queries";
import DroppableArea from "@/components/DragNDrop/DroppableArea";
import TemplateCreationZone from "@/components/DragNDrop/TemplateCreationZone";
import {
  Template,
  ArrayToIterate,
  IZone,
  ImgPreviews,
  IListElement,
} from "@/types/interfaces/template/template-interfaces";
import DataTemplate from "@/components/DragNDrop/DataTemplate";
import TemplateNavBar from "@/components/NavBars/TemplateNavBar";

const TemplateModificationPage: React.FC = () => {
  const router = useRouter();
  const { listElements } = useTemplateUtils();
  const { template_id } = router.query;
  const {
    templateToModify,
    setTemplateToModify,
    zones,
    setZones,
    imgPreviews,
    setImgPreviews,
    oldZonesId,
    setOldZonesId,
  } = useTemplate();
  const [arrayToIterate, setArrayToIterate] = useState<ArrayToIterate | null>(
    null
  );

  const { data, loading, error } = useQuery(GET_TEMPLATE_BY_ITS_ID, {
    variables: { templateId: parseFloat(template_id as string) },
    onCompleted: (data) => {
      if (data && data.getTemplateByItsId) {
        const template = data.getTemplateByItsId;

        setTemplateToModify(template);
        setArrayToIterate({
          zones: template.zones || [],
          key: "templateToModify",
        });

        // On set immédiatement les ids de zones à supprimer plus tard pour l'intégrité
        const filteredZones = template.zones?.filter(
          (zone: IZone) => typeof zone.id === "number"
        );
        if (filteredZones && filteredZones.length > 0) {
          const zoneIds = filteredZones.map((zone: IZone) => zone.id);
          setOldZonesId(zoneIds);
        }
      }
    },
  });

  useEffect(() => {
    if (templateToModify) {
      setArrayToIterate({
        zones: templateToModify.zones || [],
        key: "templateToModify",
      });
    }
  }, [templateToModify]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!arrayToIterate) return <p>No template data available.</p>;

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination || !draggableId || !arrayToIterate) return;

    const newZones = arrayToIterate.zones.map((zone) => {
      if (imgPreviews) {
        const existingPreview = imgPreviews.find(
          (obj) => obj.zoneId === zone.id
        );
        if (existingPreview) {
          URL.revokeObjectURL(existingPreview.imgPreview);
          const updatedPreviews = imgPreviews.filter(
            (obj) => obj.zoneId !== zone.id
          );
          setImgPreviews(
            updatedPreviews.length > 0 ? updatedPreviews : undefined
          );
          console.log("Updated imgPreviews:", updatedPreviews);
        }
      }
      if (zone.id === destination.droppableId) {
        const droppedElement = listElements.find((el) => el.id === draggableId);
        return {
          ...zone,
          moduleType: droppedElement
            ? droppedElement.title.toLowerCase()
            : zone.moduleType,
          size: "",
          content: "",
        };
      }
      return zone;
    });

    const updateFunction =
      arrayToIterate.key === "templateToModify"
        ? setTemplateToModify
        : setZones;

    updateFunction((prev: any) => ({ ...prev, zones: newZones }));
  };

  return (
    <>
      <TemplateNavBar 
      saveButtonColor="[#766060]"
      saveButtonHoverColor="[#5F4D4D]"
      />
      <section className="w-full h-[90dvh] flex justify-between bg-[#766060] gap-24">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <DataTemplate />
          <TemplateCreationZone arrayToIterate={arrayToIterate} />
          <DroppableArea />
        </DragDropContext>
      </section>
    </>
  );
};

export default TemplateModificationPage;
