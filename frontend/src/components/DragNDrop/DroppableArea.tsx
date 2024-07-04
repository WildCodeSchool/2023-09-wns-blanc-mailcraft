import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ZoneCreation from "./ZoneCreation";
import Module from "./Module";
import { useTemplateUtils } from "@/utils/templateUtils";

const DroppableArea = () => {
  const { listElements } = useTemplateUtils();

  return (
    <section className="w-[20%] h-[90%] me-5 my-6">
      <Droppable droppableId="droppable-area" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col justify-center items-start gap-6 p-2 bg-white h-full border border-gray-300 rounded-lg shadow-xl ${
              snapshot.isDraggingOver ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex flex-col w-full gap-3 ms-2">
              <h1 className="font-medium text-xl">Structures</h1>
              <ZoneCreation />
            </div>
            <div className="flex flex-col items-start w-full gap-3 ms-2">
              <h1 className="font-medium text-xl">Modules</h1>
              <div className="grid grid-cols-2 gap-6">
                {listElements.map((el, index) => (
                   <Draggable key={el.id} draggableId={el.id} index={index}>
                   {(provided) => (
                     <div
                       ref={provided.innerRef}
                       {...provided.draggableProps}
                       {...provided.dragHandleProps}
                       className="rounded-md w-20 h-auto bg-gray-100 flex justify-center items-center shadow-md"
                     >
                       <Module title={el.title} picture={el.picture} />
                     </div>
                   )}
                 </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </section>
  );
};

export default DroppableArea;
