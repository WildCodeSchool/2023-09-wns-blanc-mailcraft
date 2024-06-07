import { DragDropContext } from "react-beautiful-dnd";
import { useTemplate } from "@/contexts/TemplateContext";
import ZoneCreation from "@/components/dragNdrop/ZoneCreation";
import DroppableArea from "@/components/dragNdrop/DroppableArea";
import TemplateCreationZone from "@/components/dragNdrop/TemplateCreationZone";
import DesignCard from "@/components/dragNdrop/DesignCard";
import Link from "next/link";
import { useTemplateUtils } from "@/utils/templateUtils";
import { useEffect, useState } from "react";
import { ArrayToIterate } from "@/types/interfaces/template/template-interfaces";

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
      <div className="flex justify-between mt-5">
        <ZoneCreation />
        <section>
          <Link
            href="/user/myTemplates"
            className="p-2 border-red-950 border-solid border-4 text-black bg-white my-5"
          >
            Mes Templates test
          </Link>
          <Link
            href="/user/myTemplatesDrafts"
            className="p-2 border-red-950 border-solid border-4 text-black bg-white my-5"
          >
            Mes Brouillons
          </Link>
        </section>
        <section className="invisible"></section>
      </div>
      <section className="w-full flex justify-between">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <DroppableArea />
          <TemplateCreationZone arrayToIterate={arrayToIterate} />
        </DragDropContext>
        <DesignCard />
      </section>
    </>
  );
};

export default TemplatePage;
