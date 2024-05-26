import { Droppable, Draggable } from "react-beautiful-dnd";
import Module from "./Module";
import { useTemplateUtils } from "@/utils/templateUtils";
const DroppableArea = () => {
  const { listElements } = useTemplateUtils();
  return (
    <Droppable droppableId="elements" direction="horizontal">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col items-center gap-5 overflow-auto p-4 bg-[#f4f4f4] w-[20%] mt-5"
          style={{ minHeight: "100px" }}
        >
          {listElements.map((el, index) => (
            <Draggable key={el.id} draggableId={el.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="p-2 m-2 bg-white border w-[50%] flex justify-center"
                >
                  <Module title={el.title} picture={el.picture} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DroppableArea;
