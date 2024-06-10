import { Droppable, Draggable } from "react-beautiful-dnd";
import Module from "./Module";
import { useTemplateUtils } from "@/utils/templateUtils";

const DataTemplate = () => {

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white w-[20%] my-6 ms-5 border border-gray-300 rounded-lg shadow-xl"
      style={{ minHeight: "100px" }}
    >
      <h1 className="font-medium text-xl text-center mb-5 text-gray-800">Informations</h1>
      <div className="flex flex-col gap-8">
        <div className="input flex flex-col gap-2">
          <label htmlFor="title" className="font-medium ms-1 text-[#5C5A5A]">Titre du template</label>
          <div className="form-control w-full">
            <input
              type="text"
              name="title"
              id="title"
              required
              className="input input-bordered border-red-100 w-11/12 h-5/6 rounded-md bg-[#FFEDED]"
            />
          </div>
        </div>
        <div className="input flex flex-col gap-2">
          <label htmlFor="nature" className="font-medium ms-1 text-[#5C5A5A]">Nature du template</label>
          <div className="form-control w-full">
            <select
              name="nature"
              id="nature"
              required
              className="select select-bordered border-red-100 w-11/12 h-8 rounded-md bg-[#FFEDED] text-gray-400"
            >
              <option value="option1" selected>Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        </div>
        <div className="input flex flex-col gap-3">
          <label htmlFor="description" className="font-medium ms-1 text-[#5C5A5A]">Description du template</label>
          <div className="form-control w-full">
            <textarea
              name="description"
              id="description"
              required
              className="textarea textarea-bordered border-red-100 w-11/12 h-56 rounded-md bg-[#FFEDED]"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTemplate;
