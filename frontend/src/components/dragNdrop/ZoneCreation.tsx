import { useTemplate } from "@/contexts/TemplateContext";
import React from "react";

interface ZoneCreationProps {
  arrayToSet?: string;
}

const ZoneCreation: React.FC<ZoneCreationProps> = ({ arrayToSet }) => {
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
  );
};

export default ZoneCreation;
