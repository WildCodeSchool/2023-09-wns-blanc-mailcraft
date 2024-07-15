import { templateNatures } from "@/utils/templateNatures";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import { ArrayToIterate } from "@/types/interfaces/template/template-interfaces";
import { useTemplate } from "@/contexts/TemplateContext";
import { useEffect, useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import boldIcon from "@/assets/template-page/boldIcon.png";
import italicIcon from "@/assets/template-page/italicIcon.png";
import underlineIcon from "@/assets/template-page/underlineIcon.png";
import alignLeft from "@/assets/template-page/alignLeft.png";
import alignCenter from "@/assets/template-page/alignCenter.png";
import alignRight from "@/assets/template-page/alignRight.png";

interface DataTemplateProps {
  arrayToIterate: string;
}

const DataTemplate: React.FC<DataTemplateProps> = ({ arrayToIterate }) => {
  const { handleTemplateChange } = useTemplateCommonUtils();
  const { template, templateToModify } = useTemplate();
  const isTemplateToModify = arrayToIterate === "templateToModify";
  const [selectedStyleIconIndex, setSelectedStyleIconIndex] = useState<number | null>(null);
  const [selectedJustificationIconIndex, setSelectedJustificationIconIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState("#FFEDED");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleStyleIconClick = (index: number) => {
    setSelectedStyleIconIndex(index === selectedStyleIconIndex ? null : index);
  };

  const handleJustificationIconClick = (index: number) => {
    setSelectedJustificationIconIndex(index === selectedJustificationIconIndex ? null : index);
  };

  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
  };

  const styleIcons = [
    { src: boldIcon.src, alt: "Bold Icon" },
    { src: italicIcon.src, alt: "Italic Icon" },
    { src: underlineIcon.src, alt: "Underline Icon" }
  ];

  const justificationIcons = [
    { src: alignLeft.src, alt: "Align left Icon" },
    { src: alignCenter.src, alt: "Align center Icon" },
    { src: alignRight.src, alt: "Align right Icon" }
  ];

  return (
    <div className="flex flex-col justify-start gap-8 p-4 bg-white w-[20%] h-[90%] my-6 ms-5 border border-gray-300 rounded-lg shadow-xl" style={{ minHeight: "100px" }}>
      <div className="flex justify-center items-center">
        <h1 className="font-medium text-xl text-center text-gray-800">Informations</h1>
      </div>
      <div className="input flex flex-col gap-2">
        <label htmlFor="title" className="font-medium ms-1 text-[#5C5A5A]">Titre du template</label>
        <div className="form-control w-full">
          <input
            value={arrayToIterate === "templateToModify" ? templateToModify?.title : template?.title}
            onChange={(e) => { handleTemplateChange(e, "title", arrayToIterate); }}
            required
            placeholder="Entrez votre titre ici..."
            className={`input input-bordered border-red-100 w-full h-8 pl-2 rounded-md ${isTemplateToModify ? "bg-[#766060] text-white" : "bg-[#FFEDED] text-gray-700"}`}
          />
        </div>
      </div>
      <div className="input flex flex-col gap-2">
        <label htmlFor="nature" className="font-medium ms-1 text-[#5C5A5A]">Nature du template</label>
        <div className="form-control w-full">
          <select
            onChange={(e) => { handleTemplateChange(e, "templateNature", arrayToIterate); }}
            required
            className={`select select-bordered border-red-100 w-full h-8 pl-2 rounded-md ${isTemplateToModify ? "bg-[#766060] text-white" : "bg-[#FFEDED] text-gray-700"}`}
          >
            {templateNatures.map((templateNature, index) => (
              <option key={index} value={templateNature} selected>{templateNature}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="input flex flex-col gap-3">
        <label htmlFor="description" className="font-medium ms-1 text-[#5C5A5A]">Description du template</label>
        <div className="form-control w-full">
          <textarea
            required
            value={arrayToIterate === "templateToModify" ? templateToModify?.description : template?.description}
            onChange={(e) => { handleTemplateChange(e, "description", arrayToIterate); }}
            placeholder="Entrez votre description ici..."
            className={`textarea textarea-bordered border-red-100 w-full h-[15dvh] pt-1 px-2 rounded-md focus:border-red-100 focus:ring-0 resize-none text-gray-700 ${isTemplateToModify ? "bg-[#766060] placeholder-gray-300 text-white" : "bg-[#FFEDED] text-gray-700"}`}
          ></textarea>
        </div>
      </div>
      <h1 className="font-medium text-xl text-center text-gray-800 2xl:mt-5">Style</h1>
      <div className="flex items-center gap-3 2xl:gap-6 2xl:mb-4">
        <div className="flex bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 text-sm w-3/4">
          {styleIcons.map((icon, index) => (
            <div
              key={index}
              className={`styleIcon flex-1 ${index === styleIcons.length - 1 ? '' : 'border-r'} border-gray-300 flex justify-center items-center cursor-pointer ${selectedStyleIconIndex === index ? 'bg-gray-300' : ''}`}
              onClick={() => handleStyleIconClick(index)}
            >
              <img src={icon.src} className="h-4" alt={icon.alt} />
            </div>
          ))}
        </div>
        <select
          onChange={(e) => { handleTemplateChange(e, "fontSize", arrayToIterate); }}
          className={`select select-bordered border-red-100 w-20 h-8 pl-2 rounded-md ${isTemplateToModify ? "bg-[#766060] text-white" : "bg-[#FFEDED] text-gray-700"}`}
        >
          {[12, 14, 16, 18, 20, 24, 28, 32, 36].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3 2xl:gap-6 2xl:mb-4">
        <div className="flex bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 text-sm w-3/4">
          {justificationIcons.map((icon, index) => (
            <div
              key={index}
              className={`justificationIcon ${index === justificationIcons.length - 1 ? '' : 'border-r'} flex-1 border-gray-300 flex justify-center items-center cursor-pointer ${selectedJustificationIconIndex === index ? 'bg-gray-300' : ''}`}
              onClick={() => handleJustificationIconClick(index)}
            >
              <img src={icon.src} className="h-5" alt={icon.alt} />
            </div>
          ))}
        </div>
        <div className="relative">
          <div
            className="colorSwatch w-14 h-8 rounded-md cursor-pointer"
            style={{ backgroundColor: selectedColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <div className="absolute z-10 transform -translate-y-full -mt-10">
              <ChromePicker color={selectedColor} onChange={handleColorChange} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DataTemplate;
