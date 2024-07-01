import Image from 'next/image';
import React, { useState } from "react";
import { IZone } from "@/types/interfaces/template/template-interfaces";
import ActionPanelTemplateCard from "./ActionPanelTemplateCard";
import facebookIcon from "@/assets/template-page/social/facebook_145802.png";
import twitterIcon from "@/assets/template-page/social/twitter_152809.png";
import linkedinIcon from "@/assets/template-page/social/linkedin_145807.png";

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
  description,
}) => {
  const [showDataPanel, setShowDataPanel] = useState(false);
  console.log("zones ici : ", zones);

  const toggleDataPanel = () => {
    setShowDataPanel(!showDataPanel);
  };

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
      <div className="flex justify-center items-center w-4/5 h-10 bg-white border border-gray-400 rounded-lg text-xl me-2">
        {title}
      </div>
      <div className="template-wrapper flex items-center relative">
        <ActionPanelTemplateCard
          templateId={templateId}
          showDataPanel={showDataPanel}
          onTogglePanel={toggleDataPanel}
        />
        <div className="template-container flex flex-col justify-center border border-gray-400 shadow-lg py-5 px-3 w-[16rem] md:w-[21rem] h-[26rem] rounded-lg bg-white relative overflow-hidden group">
          <div className="flex flex-col relative">
            {zones.map((zone, zoneIndex) => (
              <div key={zone.id} className="flex justify-center gap-3 my-4 md:mx-2">
                {zone.subZones?.map((subZone, subZoneIndex) => (
                  <div
                    key={subZone.id}
                    className={`flex p-2 h-24 md:max-h-none text-sm md:text-base border-2 border-dashed border-gray-600 ${getWidthClass(zone.subZones.length)}`}
                  >
                    {subZone.moduleType === 'texte' ? (
                      <p className="text-gray-800">{truncateText(subZone.content, 7)}</p>
                    ) : subZone.moduleType === 'image' ? (
                      <Image
                        src={subZone.content}
                        alt="logo or image"
                        width={facebookIcon.width}
                        height={facebookIcon.height}
                        className="object-contain"
                      />
                    ) : subZone.moduleType === 'social' ? (
                      <div className="flex justify-around items-center w-full">
                        <Image
                          src={facebookIcon}
                          alt="facebook"
                          className="w-full h-8 object-contain rounded"
                        />
                        <Image
                          src={twitterIcon}
                          alt="twitter"
                          className="w-full h-8 object-contain rounded"
                        />
                        <Image
                          src={linkedinIcon}
                          alt="linkedIn"
                          className="w-full h-8 object-contain rounded"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            className={`template-panel absolute top-0 left-0 w-full h-full bg-[#9F3D3D] z-10 flex flex-col justify-between items-center transition-opacity ${showDataPanel ? "opacity-100" : "opacity-0"
              }`}
          >
            <h1 className="text-white text-2xl mt-3 font-medium">{title}</h1>
            <p className="text-white text-xl italic">{description}</p>
            <div>{/* Div vide pour le placement flexbox */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
