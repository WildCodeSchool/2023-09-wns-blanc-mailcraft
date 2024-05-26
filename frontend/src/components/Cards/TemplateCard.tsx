import React from "react";
import { IZone } from "@/types/interfaces/template/template-interfaces";
import dynamic from "next/dynamic";
interface TemplateCardProps {
  title: string;
  zones: IZone[];
  isCreated: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  zones,
  isCreated,
}) => {
  return (
    <div className="template-container border-2 border-gray-600 flex flex-col p-5 w-64 rounded-lg shadow-lg bg-white relative overflow-hidden group">
      <h2 className="text-xl text-[#E83B4E] mb-4">{title}</h2>
      <div className="relative flex flex-col h-full">
        {zones.map((zone: any, index: any) => (
          <div
            key={zone.id}
            className="flex flex-col gap-2 mb-4 p-2 border-2 border-dashed border-gray-300 rounded transition duration-300 ease-in-out group-hover:blur-sm"
          >
            {zone.moduleType === "texte" ? (
              <p className="text-gray-700">{zone.content}</p>
            ) : (
              <img
                src={zone.content}
                alt="logo or image"
                className="w-full h-32 object-cover rounded"
              />
            )}
          </div>
        ))}
        <div className="action-panel absolute top-0 right-0 h-full w-16 bg-gray-100 flex flex-col items-center justify-center transform translate-x-full opacity-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
          <button className="mb-2 text-green-600 hover:text-green-800">
            <i className="fas fa-save"></i>
          </button>
          <button className="text-red-600 hover:text-red-800">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
