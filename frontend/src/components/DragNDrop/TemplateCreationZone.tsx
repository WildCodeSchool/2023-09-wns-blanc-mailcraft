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

import React, { useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import { useTemplate } from "@/contexts/TemplateContext";

const ResizePanel = dynamic(() => import("react-resize-panel"), { ssr: false });

interface TemplateCreationZoneProps {
  draggingItemType: string | null;
}

const TemplateCreationZone: React.FC<TemplateCreationZoneProps> = ({
  draggingItemType,
}) => {
  const { zones, setZones } = useTemplate();

  useEffect(() => {
    if (!zones.length) {
      setZones([
        { id: "zone-1", subZones: [] },
        { id: "zone-2", subZones: [] },
        { id: "zone-3", subZones: [] },
      ]);
    }
  }, [zones, setZones]);

  return (
    <section className="flex flex-col w-[65%] p-4 bg-white justify-center mt-10">
      {zones.map((zone, index) => (
        <Droppable
          key={zone.id}
          droppableId={zone.id}
          isDropDisabled={draggingItemType === "module"}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`zone ${
                snapshot.isDraggingOver ? "bg-light-pink" : "bg-white"
              }`}
              style={{
                padding: "20px",
                border: "2px dashed gray",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              {zone.subZones.length > 0 ? (
                zone.subZones.map((subZone, subIndex) => (
                  <Droppable key={subZone.id} droppableId={subZone.id}>
                    {(providedSub, snapshotSub) => (
                      <ResizePanel
                        direction="e"
                        style={{
                          flex: `1 1 ${100 / zone.subZones.length}%`,
                          minWidth: "50px",
                          minHeight: "100px",
                          border: "1px dashed blue",
                          padding: "10px",
                          position: "relative",
                        }}
                        handleClasses={{ right: "resize-handle" }}
                      >
                        <div
                          ref={providedSub.innerRef}
                          {...providedSub.droppableProps}
                          className="subzone"
                          style={{ width: "100%" }}
                        >
                          {!subZone.content && (
                            <i
                              className="fa fa-plus-circle text-gray-500 cursor-pointer"
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            />
                          )}
                          {subZone.moduleType === "texte" && (
                            <textarea
                              value={subZone.content || ""}
                              onChange={(e) => {}}
                              placeholder="Enter text here"
                              className="textarea"
                              style={{ width: "100%", height: "80px" }}
                            />
                          )}
                          {subZone.moduleType === "image" && (
                            <img
                              src={subZone.content || "placeholder-image-url"}
                              alt="Placeholder"
                              style={{ width: "100%", height: "auto" }}
                            />
                          )}
                          {subZone.moduleType === "logo" && (
                            <img
                              src={subZone.content || "placeholder-logo-url"}
                              alt="Placeholder"
                              style={{ width: "100px", height: "100px" }}
                            />
                          )}
                          <button
                            className="absolute top-0 right-0 p-1 text-lg"
                            onClick={() => {
                              // Remove subzone logic
                            }}
                          >
                            ×
                          </button>
                          {providedSub.placeholder}
                        </div>
                      </ResizePanel>
                    )}
                  </Droppable>
                ))
              ) : (
                <p className="text-gray-500 text-center flex-grow">
                  Drop columns here
                </p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </section>
  );
};

export default TemplateCreationZone;
