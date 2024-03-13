import { Droppable } from "react-beautiful-dnd";

export default function Surface() {
  return (
    <Droppable droppableId="droppable-surface">
      {(provided) => (
        <section
          className="flex justify-center items-center w-1/2 h-[450px] border-solid border-4 border-gray-700"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h2 className="text-2xl">DRAG DROP HERE</h2>
          {provided.placeholder}
        </section>
      )}
    </Droppable>
  );
}
