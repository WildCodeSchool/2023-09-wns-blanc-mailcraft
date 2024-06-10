import { Droppable, Draggable } from "react-beautiful-dnd";
import Module from "./Module";
import { useTemplateUtils } from "@/utils/templateUtils";
import ZoneCreation from "./ZoneCreation";

const DroppableArea = () => {
  const { listElements } = useTemplateUtils();
  return (
    <Droppable droppableId="elements" direction="horizontal">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col items-start gap-3 p-4 bg-white w-[20%] my-6 me-5 border border-gray-300 rounded-lg shadow-xl"
          style={{ minHeight: "100px" }}
        >
          <h1 className="font-medium text-lg ms-1">Structures</h1>
            <ZoneCreation />
          <h1 className="font-medium text-lg ms-1 mt-7">Modules</h1>
          <div className="grid grid-cols-2 gap-6">
            {listElements.map((el, index) => (
              <Draggable key={el.id} draggableId={el.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="rounded-lg bg-gray-100 flex justify-center shadow-md"
                  >
                    <Module title={el.title} picture={el.picture} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  );
};

export default DroppableArea;
