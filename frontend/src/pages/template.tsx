import React, { useState } from "react";
import dynamic from "next/dynamic";
import Surface from "@/components/drag&drop/Surface";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Define the color keys type
type ColorKey = "Rouge" | "Bleu" | "Vert";

// Define the initial item type
type Item = {
  id: string;
  content: ColorKey;
};

const initialItems: Item[] = [
  { id: "item-1", content: "Rouge" },
  { id: "item-2", content: "Bleu" },
  { id: "item-3", content: "Vert" },
];

// Define the color mapping
const colorMapping: Record<ColorKey, string> = {
  Rouge: "border-red-900",
  Bleu: "border-blue-900",
  Vert: "border-green-900",
};

export default function templatePage() {
  const [items, setItems] = useState<Item[]>(initialItems);

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;

    const updatedItems = Array.from(items);
    const [reorderedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, reorderedItem);

    setItems(updatedItems);
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <section className="w-full flex justify-between">
        <Droppable droppableId="droppable-1">
          {(provided) => (
            <section
              className="w-30% flex flex-col gap-5 border-solid border-4 border-black p-5 ml-10"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h1>Section 1</h1>
              {items.map((item, index) => {
                const itemContent: ColorKey = item.content; // Cast to ColorKey type
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        className={`border-4 border-solid ${colorMapping[itemContent]}`}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </section>
          )}
        </Droppable>
        <Surface />
        <section className="invisible"></section>
      </section>
    </DragDropContext>
  );
}
