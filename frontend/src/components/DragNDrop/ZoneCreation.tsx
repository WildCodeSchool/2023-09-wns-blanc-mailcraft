import { useTemplate } from "@/contexts/TemplateContext";
import React from "react";
import dragAndDropIcon from "@/assets/template-page/dragNdrop.png";
import { DroppableAreaProps } from "@/types/interfaces/props/droppableArea-props-types";

const ZoneCreation: React.FC<DroppableAreaProps> = ({ arrayToSet }) => {
  const { setZones, setTemplateToModify, templateToModify } = useTemplate();

  const createZones = (number: number) => {
    const newZones = Array.from({ length: number }).map((_, index) => ({
      id: `zone-${index}`,
      moduleType: "",
      size: "",
      content: "",
    }));

    if (arrayToSet === "templateToModify" && templateToModify) {
      setTemplateToModify({ ...templateToModify, zones: newZones });
    } else {
      setZones(newZones);
    }
  };

  return (
    <section className="flex flex-col items-start gap-3 w-full">
      {[1, 2, 3].map((number) => (
        <button
          key={number}
          onClick={() => createZones(number)}
          className="relative border border-1 border-gray-300 shadow-md rounded-md p-2 w-11/12 h-16 flex flex-col items-center justify-center text-md"
        >
          <img
            src={dragAndDropIcon.src}
            alt="Drag and Drop"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          />
          <div className="flex items-center justify-center gap-2 my-2 ms-5 w-full">
            {Array.from({ length: number }).map((_, index) => (
              <div
                key={index}
                className={`h-6 bg-gray-300 rounded-md`}
                style={{ width: `${70 / number}%` }}
              ></div>
            ))}
          </div>
          <span className="ms-5">
            {number} ZONE{number > 1 ? "S" : ""}
          </span>
        </button>
      ))}
    </section>
  );
};

export default ZoneCreation;
