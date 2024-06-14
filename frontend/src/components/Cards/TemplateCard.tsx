import React, { useState } from "react";
import { IZone } from "@/types/interfaces/template/template-interfaces";
import ActionPanelTemplateCard from "./ActionPanelTemplateCard";

interface TemplateCardProps {
  templateId: number;
  title: string;
  zones: IZone[];
  isCreated: boolean;
  description: string;
}

// Fonction pour tronquer le texte dans les zones à 8 mots maximum
const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "..";
  }
  return text;
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  templateId,
  title,
  zones,
  description
}) => {
  const [showDataPanel, setShowDataPanel] = useState(false);

  const toggleDataPanel = () => {
    setShowDataPanel(!showDataPanel);
  };

  const fakeZones = [
    { content: "je vous envoie un mail pour vous contacter à propos des services que l'on veut vous vendre blabla lorem ipsum bkedd ffcff", id: "48", moduleType: "texte" },
    { content: "https://res.cloudinary.com/dyhn66mah/image/upload/v1718008067/Mailcraft/a6m9jwmns4ls1ay4wjpi.jpg", id: "49", moduleType: "image" },
    { content: "au revoir", id: "50", moduleType: "texte" },

  ];

  console.log("zones ici : ", zones);

  //Fonction pour déterminer la taille des zones selon leur nombre dans leur row
  const getWidthClass = (length: number) => {
    switch (length) {
      case 1:
        return "w-full";
      case 2:
        return "w-1/2";
      case 3:
      default:
        return "w-[31%]";
    }
  };

  return (
    <div className="flex flex-col items-end gap-3 relative">
      <div className="flex justify-center items-center w-4/5 h-10 bg-white border border-gray-400 rounded-lg text-xl me-2">{title}</div>
      <div className="template-wrapper flex items-center relative">
        <ActionPanelTemplateCard
          templateId={templateId}
          showDataPanel={showDataPanel}
          onTogglePanel={toggleDataPanel}
        />
        <div className="template-container flex flex-col justify-center border border-gray-400 shadow-lg py-5 px-3 w-[16rem] md:w-[21rem] h-[26rem] rounded-lg bg-white relative overflow-hidden group">
          <div className="flex flex-col relative gap-6">
            {/* {fakeZones.map((zoneArray: any[], zoneIndex: any) => (
              <div key={zoneIndex} className="flex flex-row justify-center gap-3 my-4 md:mx-2"> */}
            {/* {zoneArray.map((fakeZone: any, index: any) => (
                  <div
                    key={index}
                    className={`p-2 max-h-32 md:max-h-none text-sm md:text-base border-2 border-dashed border-gray-600 ${getWidthClass(zoneArray.length)}`}
                  >
                    {fakeZone.moduleType === "texte" ? (
                      <p className="text-gray-800">{truncateText(fakeZone.content, 7)}</p>
                    ) : (
                      <img
                        src={fakeZone.content}
                        alt="logo or image"
                        className="w-full h-32 object-contain rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))} */}
            {fakeZones.map((zone: any, index: any) => (
              <div
                key={zone.id}
                className={`p-2 max-h-32 h-28 text-sm md:text-lg border-2 border-dashed border-gray-600`}
              >
                {zone.moduleType === "texte" ? (
                  <p className="text-gray-800">{truncateText(zone.content, 15)}</p>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      src={zone.content}
                      alt="logo or image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={`template-panel absolute top-0 left-0 w-full h-full bg-[#9F3D3D] z-10 flex flex-col justify-between items-center transition-opacity ${showDataPanel ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-white text-2xl mt-3 font-medium">{title}</h1>
            <p className="text-white text-xl italic">{description}</p>
            <div>
              {/* Div vide pour le placement flexbox */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
