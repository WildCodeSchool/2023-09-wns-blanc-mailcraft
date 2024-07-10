// import React, { useRef, useCallback, useEffect } from "react";
// import Modal from "react-modal";
// import Image from "next/image";
// import { Droppable } from "react-beautiful-dnd";
// import dynamic from "next/dynamic";
// import { useTemplate } from "@/contexts/TemplateContext";
// import { useTemplateUtils } from "@/utils/templateUtils";
// import { IZone } from "@/types/interfaces/template/template-interfaces";

// // Dynamic import for components that interact with the DOM (SSR disabled)
// const ResizePanel = dynamic(() => import("react-resize-panel"), { ssr: false });

// // Custom hook for merging refs
// const useMergedRef = (...refs) =>
//   useCallback((node) => {
//     refs.forEach((ref) => {
//       if (!ref) return;
//       if (typeof ref === "function") {
//         ref(node);
//       } else {
//         ref.current = node;
//       }
//     });
//   }, []);

// const TemplateCreationZone: React.FC = () => {
//   const { zones, setZones } = useTemplate();
//   const {
//     handleResetZones,
//     createHandleFileChange,
//     handleTextChange,
//     removeZone,
//     getImageSrc,
//   } = useTemplateUtils();

//   const fileInputRefs = useRef({});
//   const resizeObservers = useRef(new Map());

//   const handleResize = useCallback(
//     (zoneId) => (entries) => {
//       const entry = entries[0];
//       const newWidth = Math.ceil(entry.contentRect.width).toString();
//       console.log(`Resizing zone with ID: ${zoneId}, new width: ${newWidth}px`);

//       setZones((prevZones) =>
//         prevZones.map((zone) =>
//           zone.id === zoneId && zone.size !== newWidth
//             ? { ...zone, size: newWidth }
//             : zone
//         )
//       );
//     },
//     [setZones]
//   );

//   useEffect(() => {
//     return () => {
//       resizeObservers.current.forEach((observer) => observer.disconnect());
//     };
//   }, []);

//   return (
//     <section className="bg-white flex flex-col justify-center items-end w-[40%] h-[85dvh] border border-gray-300 p-2 my-4 shadow-lg">
//       <button onClick={() => handleResetZones("zones")}>
//         {/* Reset Icon SVG */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="w-6 h-6"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.75 9v6m-7.5-6v6m3-9V4.5m0 15V15m0 0a6 6 0 110-12V3m0 12a6 6 0 100 12v-3m0-12V3m0 12v3"
//           />
//         </svg>
//       </button>

//       <div className="w-full h-full flex flex-col justify-center items-center p-4 gap-5 overflow-auto">
//         {zones.map((zone: IZone) => (
//           <Droppable key={zone.id} droppableId={zone.id}>
//             {(provided, snapshot) => (
//               <ResizePanel direction="e">
//                 <div
//                   ref={useMergedRef(provided.innerRef, (node) => {
//                     if (node) {
//                       if (!resizeObservers.current.has(zone.id)) {
//                         const resizeHandler = handleResize(zone.id);
//                         const observer = new ResizeObserver(resizeHandler);
//                         observer.observe(node);
//                         resizeObservers.current.set(zone.id, observer);
//                       }
//                     } else {
//                       resizeObservers.current.get(zone.id)?.disconnect();
//                       resizeObservers.current.delete(zone.id);
//                     }
//                   })}
//                   {...provided.droppableProps}
//                   className={`flex flex-col justify-center items-center min-h-[100px] w-full border-2 ${
//                     snapshot.isDraggingOver
//                       ? "bg-green-100"
//                       : "border-dashed border-gray-500"
//                   } p-4 relative m-2`}
//                 >
//                   {/* Zone content rendering based on moduleType */}
//                   {zone.moduleType === "text" && (
//                     <textarea
//                       className="w-full h-40 p-4 border-2 border-gray-300"
//                       value={zone.content || ""}
//                       placeholder="YOUR TEXT HERE"
//                       onChange={(e) =>
//                         handleTextChange(e, zones, zone.id, "template")
//                       }
//                     ></textarea>
//                   )}
//                   {zone.moduleType === "image" && (
//                     <button
//                       onClick={() => fileInputRefs.current[zone.id]?.click()}
//                     >
//                       <Image
//                         src={getImageSrc(zone, "image")}
//                         alt="Template Image"
//                         width={150}
//                         height={150}
//                       />
//                       <input
//                         type="file"
//                         hidden
//                         ref={(el) => (fileInputRefs.current[zone.id] = el)}
//                         onChange={(event) =>
//                           createHandleFileChange(zone.id)(
//                             event,
//                             zones,
//                             "template"
//                           )
//                         }
//                       />
//                     </button>
//                   )}
//                   {/* Additional module types can be added here */}
//                   <button
//                     className="absolute top-0 right-0 p-2 text-lg"
//                     onClick={() => removeZone(zones, zone.id, "template")}
//                   >
//                     &times;
//                   </button>
//                   {provided.placeholder}
//                 </div>
//               </ResizePanel>
//             )}
//           </Droppable>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default TemplateCreationZone;

///////////////////////// VERSION 1 /////////////////////////////////

import React, { useEffect, useRef } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateCreationUtils } from "@/utils/templateCreationUtils";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";

const TemplateCreationZone = ({ draggingItemType, socialModule }) => {
  const { zones, setZones, isModalErrorOpen, errorMessage } = useTemplate();
  const { saveTemplate, handleCreationError } =
    useTemplateCreationUtils();

  const {
    handleTextChange,
    removeSubZone,
    getImageSrc,
    createHandleFileChange,
    handleResetZones,
    closeErrorModal
  } = useTemplateCommonUtils();

  const fileInputRefs = useRef({});

  useEffect(() => {
    // Initialize zones if they are empty
    if (zones.length === 0) {
      setZones([
        { id: "zone-1", order: 1, subZones: [] },
        { id: "zone-2", order: 2, subZones: [] },
        { id: "zone-3", order: 3, subZones: [] },
      ]);
    }
  }, [zones, setZones]);

  useEffect(() => {
    console.log(`New Zones are ${JSON.stringify(zones)}`);
  }, [zones]);

  return (
    <>
      <Droppable
        droppableId="all-zones"
        direction="vertical"
        isDropDisabled={draggingItemType !== "zone"}
      >
        {(provided) => (
          <section
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="zones-container relative flex flex-col w-[60%] p-4 bg-white justify-center mt-7"
          >
            <button className="absolute top-2 right-2" onClick={() => {
              handleResetZones("template");
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            <Modal
              isOpen={isModalErrorOpen}
              onRequestClose={closeErrorModal}
              contentLabel="Erreur"
              className="bg-white w-2/5 h-1/4 m-auto fixed inset-0 border border-gray-400 rounded-lg flex flex-col justify-start"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
            >
              <button
                onClick={closeErrorModal}
                className="absolute top-2 right-1 p-2 text-gray-700 hover:text-gray-900"
              >
                ×
              </button>
              <div className="w-full h-3 rounded-t-lg bg-red-500"></div>
              <div className="flex flex-col justify-center items-center gap-10">
                <h2 className="text-lg font-semibold text-center mt-3">
                  {errorMessage}
                </h2>
                <button
                  onClick={closeErrorModal}
                  className="px-7 py-2 bg-gray-100 text-black hover:bg-gray-200 rounded border border-gray-300 shadow-md"
                >
                  J'ai compris
                </button>
              </div>
            </Modal>

            {zones.map((zone, index) => (
              <Draggable key={zone.id} draggableId={zone.id} index={index}>
                {(providedZone, snapshotZone) => (
                  <div
                    ref={providedZone.innerRef}
                    {...providedZone.draggableProps}
                    {...providedZone.dragHandleProps}
                    className={`zone ${snapshotZone.isDragging ? "opacity-50" : ""
                      } flex flex-col gap-2.5 p-5 border-2 border-dashed border-gray-400 mb-5`}
                  >
                    <Droppable
                      droppableId={zone.id}
                      direction="horizontal"
                      isDropDisabled={
                        draggingItemType !== "column" &&
                        draggingItemType !== "subZone"
                      }
                    >
                      {(providedSub, snapshotSub) => (
                        <div
                          ref={providedSub.innerRef}
                          {...providedSub.droppableProps}
                          className="subzone-container flex gap-2"
                        >
                          {zone.subZones.length > 0 ? (
                            zone.subZones.map((subZone, subIndex) => (
                              <Draggable
                                key={subZone.id}
                                draggableId={subZone.id}
                                index={subIndex}
                              >
                                {(providedSubZone, snapshotSubZone) => (
                                  <div
                                    ref={providedSubZone.innerRef}
                                    {...providedSubZone.draggableProps}
                                    {...providedSubZone.dragHandleProps}
                                    className={`subzone flex justify-around items-center flex-1 min-w-[50px] min-h-[100px] border border-dashed border-blue-500 p-2.5 relative ${snapshotSubZone.isDragging
                                        ? "opacity-50"
                                        : ""
                                      }`}
                                  >
                                    <Droppable
                                      droppableId={subZone.id}
                                      isDropDisabled={
                                        draggingItemType !== "module"
                                      }
                                    >
                                      {(providedModule) => (
                                        <div
                                          ref={providedModule.innerRef}
                                          {...providedModule.droppableProps}
                                          className="module-container flex-1"
                                        >
                                          {!subZone.moduleType && (
                                            <i className="fas fa-plus-circle text-gray-500 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                          )}
                                          {subZone.moduleType === "texte" && (
                                            <textarea
                                              value={subZone.content || ""}
                                              onChange={(e) =>
                                                handleTextChange(
                                                  e,
                                                  zone.subZones,
                                                  subZone.id,
                                                  "template"
                                                )
                                              }
                                              placeholder="Entrez votre texte ici..."
                                              className="w-full h-20 border-0 focus:ring-0 resize-none bg-transparent p-0 m-0 overflow-hidden"
                                            />
                                          )}
                                          {subZone.moduleType === "image" && (
                                            <div className="flex justify-center ms-5 mt-2">
                                              <button
                                                onClick={() =>
                                                  fileInputRefs.current[
                                                    subZone.id
                                                  ]?.click()
                                                }
                                              >
                                                <Image
                                                  src={getImageSrc(
                                                    subZone,
                                                    "image"
                                                  )}
                                                  alt="Template Image"
                                                  width={150}
                                                  height={150}
                                                />
                                                <input
                                                  type="file"
                                                  hidden
                                                  ref={(el) =>
                                                  (fileInputRefs.current[
                                                    subZone.id
                                                  ] = el)
                                                  }
                                                  onChange={(event) =>
                                                    createHandleFileChange(
                                                      subZone.id
                                                    )(event, zones, "template")
                                                  }
                                                />
                                              </button>
                                            </div>
                                          )}
                                          {subZone.moduleType === "social" && (
                                            <div className="flex justify-around w-full">
                                              {socialModule.map((social) => (
                                                <Link
                                                  key={social.link}
                                                  href={social.link}
                                                >
                                                  <Image
                                                    src={social.src}
                                                    alt="Social Media Icon"
                                                    width={50}
                                                    height={50}
                                                  />
                                                </Link>
                                              ))}
                                            </div>
                                          )}
                                          {providedModule.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                    <button
                                      className="absolute top-0 right-0 pe-1 text-lg"
                                      onClick={() =>
                                        removeSubZone(
                                          subZone,
                                          subZone.id,
                                          "template"
                                        )
                                      }
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center flex-grow">
                              Glissez une structure ici
                            </p>
                          )}
                          {providedSub.placeholder}
                        </div>
                      )}
                    </Droppable>
                    {providedZone.placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </section>
        )}
      </Droppable>
    </>
  );
};

export default TemplateCreationZone;

// useEffect(() => {
//   if (zones.length > 0) {
//     zones.forEach((zone) => {
//       zone.subZones.forEach((subZone) => {
//         console.log(subZone.content);
//         if (subZone.links) {
//           console.log(subZone.links);
//         }
//       });
//     });
//   }

//   // Pour logger toute la structure des zones si nécessaire
//   // console.log(JSON.stringify(zones));
// }, [zones]);
