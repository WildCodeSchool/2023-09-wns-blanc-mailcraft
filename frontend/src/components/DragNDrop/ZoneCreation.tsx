import React from "react";
import { Draggable } from "react-beautiful-dnd";
import dragAndDropIcon from "@/assets/template-page/dragNdrop.png";

const ZoneCreation = () => {
  const columns = [1, 2, 3];

  return (
    <section className="flex flex-col items-start gap-3 w-full">
      {columns.map((number, index) => (
        <Draggable key={number} draggableId={`column-${number}`} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="relative border border-1 border-gray-300 shadow-md rounded-md p-2 w-11/12 h-16 flex flex-col items-center justify-center text-md"
            >
              <img
                src={dragAndDropIcon.src}
                alt="Drag and Drop"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
              />
              <div className="flex items-center justify-center gap-2 my-2 ms-5 w-full">
                {Array.from({ length: number }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-6 bg-gray-300 rounded-md`}
                    style={{ width: `${70 / number}%` }}
                  ></div>
                ))}
              </div>
              <span className="ms-5">
                {number} Colonne{number > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </Draggable>
      ))}
    </section>
  );
};

export default ZoneCreation;
