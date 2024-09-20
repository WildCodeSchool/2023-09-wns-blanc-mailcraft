import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ZoneCreation from "./ZoneCreation";
import Module from "./Module";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import { useAuth } from "@/contexts/AuthContext";

const DroppableArea = () => {
  const { listElements } = useTemplateCommonUtils();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Vérifier si l'utilisateur a des liens sociaux
  const hasSocialLinks =
    user &&
    user.socialLinks &&
    user.socialLinks.length > 0 &&
    (user.socialLinks[0].facebook ||
      user.socialLinks[0].twitter ||
      user.socialLinks[0].linkedin);

  return (
    <section className="w-full lg:w-[20%] h-[90%] me-5 my-6 relative overflow-hidden">
      <Droppable droppableId="droppable-area" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col justify-center items-start gap-8 p-2 bg-white h-full border border-gray-300 rounded-lg shadow-xl overflow-hidden"
          >
            <div
              id="structure"
              className="flex flex-col items-center w-full gap-3"
            >
              <h1 className="font-medium text-lg md:text-xl">Structures</h1>
              <ZoneCreation />
            </div>
            <div
              id="modules"
              className="flex flex-col items-center w-full gap-3"
            >
              <h1 className="font-medium text-lg md:text-xl">Modules</h1>
              <div className="grid grid-cols-2 gap-5">
                {listElements.map((el, index) => {
                  const isSocialModule = el.title.toLowerCase() === "social";
                  const moduleContent = (
                    <div
                      className={`rounded-md w-16 xl:w-20 h-auto flex justify-center shadow-md ${
                        isSocialModule && !hasSocialLinks
                          ? "bg-gray-400"
                          : "bg-gray-100"
                      }`}
                    >
                      {isSocialModule && !hasSocialLinks ? (
                        <div
                          className="flex flex-col justify-center items-center p-3"
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 1C8.68629 1 6 3.68629 6 7V10H5C3.34315 10 2 11.3431 2 13V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V13C22 11.3431 20.6569 10 19 10H18V7C18 3.68629 15.3137 1 12 1ZM8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10H8V7ZM19 12C19.5523 12 20 12.4477 20 13V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V13C4 12.4477 4.44772 12 5 12H19Z"
                              fill="currentColor"
                            />
                          </svg>
                          <div className="text-center">
                            <p className="mt-1 font-medium">Social</p>
                          </div>
                        </div>
                      ) : (
                        <Module title={el.title} picture={el.picture} />
                      )}
                    </div>
                  );

                  return (
                    <Draggable
                      key={el.id}
                      draggableId={`module-${el.title}`}
                      index={index}
                      isDragDisabled={isSocialModule && !hasSocialLinks}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="max-w-full max-h-full"
                        >
                          {moduleContent}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
              {isHovered && !hasSocialLinks && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 absolute bottom-0"
                  role="alert"
                >
                  <strong className="font-bold">Aucun lien enregistré !</strong>
                </div>
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </section>
  );
};

export default DroppableArea;
