import { DragDropContext } from "react-beautiful-dnd";
import { useTemplate } from "@/contexts/TemplateContext";
import DroppableArea from "@/components/DragNDrop/DroppableArea";
import TemplateCreationZone from "@/components/DragNDrop/TemplateCreationZone";
import { useTemplateUtils } from "@/utils/templateUtils";
import { useEffect, useState } from "react";
import { ArrayToIterate } from "@/types/interfaces/template/template-interfaces";
import DataTemplate from "@/components/DragNDrop/DataTemplate";
import TemplateNavBar from "@/components/NavBars/TemplateNavBar";

// La vue principale regroupant toute la logique de création d'un template

const TemplatePage: React.FC = () => {
  const { listElements } = useTemplateUtils();
  const { zones, setZones, imgPreviews, setImgPreviews } = useTemplate();
  const [arrayToIterate, setArrayToIterate] = useState<ArrayToIterate | null>(
    null
  );
  useEffect(() => {
    if (zones) {
      setArrayToIterate({
        zones: zones || [],
        key: "zones",
      });
    }
  }, [zones]);

  const onDragEnd = (result: any) => {
    console.log("Result is", result);

    const { destination, draggableId } = result;
    if (!destination) return;

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

  return (
    <>
      <TemplateNavBar
        saveButtonColor="[#E83B4E]"
        saveButtonHoverColor="[#BB3241]"
        arrayToSave={arrayToIterate?.key}
      />
      <section className="w-full h-[90dvh] flex justify-between bg-[#FFEDED] bg-opacity-100 gap-24">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <DataTemplate arrayToIterate={arrayToIterate} />
          <TemplateCreationZone arrayToIterate={arrayToIterate} />
          <DroppableArea arrayToSet={arrayToIterate?.key} />
        </DragDropContext>
      </section>
    </>
  );
};

export default TemplatePage;
