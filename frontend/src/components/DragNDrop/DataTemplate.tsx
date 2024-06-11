import { templateNatures } from "@/utils/templateNatures";
import { useTemplateUtils } from "@/utils/templateUtils";
import { ArrayToIterate } from "@/types/interfaces/template/template-interfaces";
import { useTemplate } from "@/contexts/TemplateContext";
import { useEffect } from "react";
interface DataTemplateProps {
  arrayToIterate: ArrayToIterate | null;
}
const DataTemplate: React.FC<DataTemplateProps> = ({ arrayToIterate }) => {
  const { handleTemplateChange } = useTemplateUtils();
  const { template, templateToModify } = useTemplate();

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 bg-white w-[20%] my-6 ms-5 border border-gray-300 rounded-lg shadow-xl"
      style={{ minHeight: "100px" }}
    >
      <h1 className="font-medium text-xl text-center mb-5 text-gray-800">
        Informations
      </h1>
      <div className="flex flex-col gap-8">
        <div className="input flex flex-col gap-2">
          <label htmlFor="title" className="font-medium ms-1 text-[#5C5A5A]">
            Titre du template
          </label>
          <div className="form-control w-full">
            <input
              value={
                arrayToIterate?.key === "templateToModify"
                  ? templateToModify?.title
                  : template?.title
              }
              onChange={(e) => {
                handleTemplateChange(e, "title", arrayToIterate?.key);
              }}
              required
              className="input input-bordered border-red-100 w-11/12 h-5/6 rounded-md bg-[#FFEDED]"
            />
          </div>
        </div>
        <div className="input flex flex-col gap-2">
          <label htmlFor="nature" className="font-medium ms-1 text-[#5C5A5A]">
            Nature du template
          </label>
          <div className="form-control w-full">
            <select
              onChange={(e) => {
                handleTemplateChange(e, "templateNature", arrayToIterate?.key);
              }}
              required
              className="select select-bordered border-red-100 w-11/12 h-8 rounded-md bg-[#FFEDED] text-gray-400"
            >
              {templateNatures.map((templateNature, index) => (
                <option value={templateNature} selected>
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
              value={
                arrayToIterate?.key === "templateToModify"
                  ? templateToModify?.description
                  : template?.description
              }
              onChange={(e) => {
                handleTemplateChange(e, "description", arrayToIterate?.key);
              }}
              className="textarea textarea-bordered border-red-100 w-11/12 h-56 rounded-md bg-[#FFEDED]"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTemplate;
