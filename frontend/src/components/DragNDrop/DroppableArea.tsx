import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ZoneCreation from "./ZoneCreation";
import Module from "./Module";
import { useTemplateUtils } from "@/utils/templateUtils";

const DroppableArea = () => {
  const { listElements } = useTemplateUtils();

  return (
    <section>
      <Droppable droppableId="droppable-area" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col items-start gap-3 p-4 bg-white w-full my-6 me-5 border border-gray-300 rounded-lg shadow-xl"
          >
            <h1 className="font-medium text-lg ms-1">Structures</h1>
            <ZoneCreation />
            <h1 className="font-medium text-lg ms-1 mt-7">Modules</h1>
            <div className="grid grid-cols-2 gap-6">
              {listElements.map((el, index) => (
                <Draggable
                  key={el.id}
                  draggableId={`module-${el.title}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="rounded-lg bg-gray-100 flex justify-center shadow-md"
                    >
                      <Module title={el.title} picture={el.picture} />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
            {provided.placeholder}{" "}
          </div>
        )}
      </Droppable>
    </section>
  );
};

export default DroppableArea;
