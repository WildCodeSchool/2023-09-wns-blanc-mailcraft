import { useState, useRef, FunctionComponent } from "react";
import Image from "next/image";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import DesignCard from "@/components/dragNdrop/DesignCard";
import imageIconSrc from "../assets/template-page/icon-image.png";
import texteIconSrc from "../assets/template-page/icon-texte.png";
import logoIconSrc from "../assets/template-page/lien-de-partage.png";

interface IListElement {
  id: string;
  title: string;
  picture: any;
}

interface IZone {
  id: string;
  moduleType: string;
}

interface ModuleProps {
  title: string;
  picture: any;
}

const Module: FunctionComponent<ModuleProps> = ({ title, picture }) => {
  return (
    <div>
      <Image src={picture} alt={title} width={40} height={40} />
      <p>{title}</p>
    </div>
  );
};

const TemplatePage: FunctionComponent = () => {
  const [zones, setZones] = useState<IZone[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const listElements: IListElement[] = [
    {
      id: "1",
      title: "Texte",
      picture: texteIconSrc,
    },
    {
      id: "2",
      title: "Image",
      picture: imageIconSrc,
    },
    {
      id: "3",
      title: "Logo",
      picture: logoIconSrc,
    },
  ];

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
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

  const createZones = (number: number) => {
    const newZones = Array.from({ length: number }).map((_, index) => ({
      id: `zone-${index}`,
      moduleType: "",
    }));
    setZones(newZones);
  };

  const removeZone = (zoneId: string) => {
    const newZones = zones.filter((zone) => zone.id !== zoneId);
    setZones(newZones);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
  };

  return (
    <>
      <section className="flex gap-2">
        {[1, 2, 3].map((number) => (
          <button
            key={number}
            className="border-2 border-gray-950 p-2"
            onClick={() => createZones(number)}
          >
            {number} ZONE{number > 1 ? "S" : ""}
          </button>
        ))}
      </section>
      <section className="w-full flex justify-between">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="elements" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col items-center gap-5 overflow-auto p-4 bg-[#f4f4f4] w-[20%] mt-5"
                style={{ minHeight: "100px" }}
              >
                {listElements.map((el, index) => (
                  <Draggable key={el.id} draggableId={el.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 m-2 bg-white border w-[50%]
                        flex justify-center"
                      >
                        <Module title={el.title} picture={el.picture} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Zones container */}
          <section className="flex flex-col justify-center items-center w-[40%] h-[90vh] border-solid border-2 border-gray-300 p-10 bg-[#E83B4E] my-4">
            <button className="w-1/2 h-[10%] mb-4" onClick={() => setZones([])}>
              Clear Zones
            </button>
            <div className="border-2 border-solid border-gray-950 w-full h-full flex justify-center items-center p-4 bg-[#fff] flex-col gap-5 overflow-auto">
              {zones.map((zone, index) => (
                <Droppable key={zone.id} droppableId={zone.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col justify-center items-center w-full min-h-[100px] border-2 ${
                        snapshot.isDraggingOver
                          ? "bg-green-100"
                          : "border-dashed border-gray-500"
                      } p-4 relative m-2`}
                    >
                      {zone.moduleType === "texte" && (
                        <textarea
                          className="w-full h-40 p-4 border-2 border-gray-300"
                          placeholder="YOUR TEXT HERE"
                        ></textarea>
                      )}
                      {zone.moduleType === "image" && (
                        <button onClick={() => fileInputRef.current.click()}>
                          <Image
                            src={imageIconSrc}
                            alt="app preview"
                            width={40}
                            height={40}
                          />
                        </button>
                      )}
                      {zone.moduleType === "logo" && (
                        <button onClick={() => fileInputRef.current.click()}>
                          <Image
                            src={logoIconSrc}
                            alt="app preview"
                            width={40}
                            height={40}
                          />
                        </button>
                      )}
                      <button
                        className="absolute top-0 right-0 p-2"
                        onClick={() => removeZone(zone.id)}
                      >
                        ✕
                      </button>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </section>
        </DragDropContext>
        <DesignCard />
      </section>
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  );
};

export default TemplatePage;
