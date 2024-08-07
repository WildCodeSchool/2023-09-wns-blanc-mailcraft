import { templateNatures } from "@/utils/templateNatures";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import { useTemplate } from "@/contexts/TemplateContext";
import React from "react";

interface DataTemplateProps {
  arrayToIterate: string;
}

const DataTemplate: React.FC<DataTemplateProps> = ({ arrayToIterate }) => {
  const { handleTemplateChange } = useTemplateCommonUtils();
  const { template, templateToModify } = useTemplate();
  const isTemplateToModify = arrayToIterate === "templateToModify";

  const currentTemplate = isTemplateToModify ? templateToModify : template;

  return (
    <div
      className="flex flex-col justify-start gap-8 p-4 bg-white w-[20%] h-[90%] my-6 ms-5 border border-gray-300 rounded-lg shadow-xl"
      style={{ minHeight: "100px" }}
    >
      <div className="flex justify-center items-center">
        <h1 className="font-medium text-xl text-center text-gray-800">
          Informations
        </h1>
      </div>
      <div className="input flex flex-col gap-2">
        <label htmlFor="title" className="font-medium ms-1 text-[#5C5A5A]">
          Titre du template
        </label>
        <div className="form-control w-full">
          <input
            value={currentTemplate?.title || ""}
            onChange={(e) => {
              handleTemplateChange(e, "title", arrayToIterate);
            }}
            required
            placeholder="Entrez votre titre ici..."
            className={`input input-bordered border-red-100 w-full h-8 pl-2 rounded-md ${
              isTemplateToModify
                ? "bg-[#766060] text-white"
                : "bg-[#FFEDED] text-gray-700"
            }`}
          />
        </div>
      </div>
      <div className="input flex flex-col gap-2">
        <label htmlFor="nature" className="font-medium ms-1 text-[#5C5A5A]">
          Nature du template
        </label>
        <div className="form-control w-full">
          <select
            value={currentTemplate?.templateNature || ""}
            onChange={(e) => {
              handleTemplateChange(e, "templateNature", arrayToIterate);
            }}
            required
            className={`select select-bordered border-red-100 w-full h-8 pl-2 rounded-md ${
              isTemplateToModify
                ? "bg-[#766060] text-white"
                : "bg-[#FFEDED] text-gray-700"
            }`}
          >
            {templateNatures.map((templateNature, index) => (
              <option key={index} value={templateNature}>
                {templateNature}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="input flex flex-col gap-3">
        <label
          htmlFor="description"
          className="font-medium ms-1 text-[#5C5A5A]"
        >
          Description du template
        </label>
        <div className="form-control w-full">
          <textarea
            required
            value={currentTemplate?.description || ""}
            onChange={(e) => {
              handleTemplateChange(e, "description", arrayToIterate);
            }}
            placeholder="Entrez votre description ici..."
            className={`textarea textarea-bordered border-red-100 w-full h-[15dvh] pt-1 px-2 rounded-md focus:border-red-100 focus:ring-0 resize-none ${
              isTemplateToModify
                ? "bg-[#766060] placeholder-gray-300 text-white"
                : "bg-[#FFEDED] text-gray-700"
            }`}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default DataTemplate;
