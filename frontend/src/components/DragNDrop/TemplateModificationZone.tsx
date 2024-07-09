// import React, { useRef, useCallback, useEffect, useState } from "react";
// import Modal from "react-modal";
// import Image from "next/image";
// import { Droppable } from "react-beautiful-dnd";
// import dynamic from "next/dynamic";
// import { useTemplate } from "@/contexts/TemplateContext";
// import { useTemplateUtils } from "@/utils/templateUtils";
// import {
//   IZone,
//   Template,
// } from "@/types/interfaces/template/template-interfaces";

// const TemplateModificationZone = () => {
//   const {
//     zones,
//     setZones,
//     templateToModify,
//     setTemplateToModify,
//     isModalModifyOpen,
//   } = useTemplate();
//   const {
//     handleResetZones,
//     createHandleFileChange,
//     handleTextChange,
//     removeZone,
//     isModalOpen,
//     closeModifyModal,
//     resetZones,
//     getImageSrc,
//     saveTemplateToModify,
//   } = useTemplateUtils();

//   return (
//     <section
//       className={`bg-white flex flex-col justify-center items-end w-[40%] h-[85dvh] border border-gray-300 p-2 my-4 shadow-lg`}
//     >
//       <button onClick={() => handleResetZones("templateToModify")}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="size-6"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//           />
//         </svg>
//       </button>

//       <Modal
//         isOpen={isModalModifyOpen}
//         onRequestClose={closeModifyModal}
//         contentLabel="Enregistrement du template"
//       >
//         <button
//           onClick={closeModifyModal}
//           className="absolute top-0 right-0 p-2 text-lg text-gray-600 hover:text-gray-800"
//         >
//           &times;
//         </button>
//         <h2 className="text-lg font-semibold text-center">
//           Êtes-vous satisfait de ce template ?
//         </h2>
//         <div className="flex justify-around mt-4">
//           <button
//             onClick={() => saveTemplateToModify(templateToModify, "created")}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
//           >
//             Oui, enregistrer
//           </button>
//           <button
//             onClick={() => saveTemplateToModify(templateToModify, "draft")}
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
//           >
//             Non, enregistrer en brouillon
//           </button>
//         </div>
//       </Modal>

//       <div className="w-full h-full flex flex-col justify-center items-center p-4 gap-5 overflow-auto">
//         {templateToModify?.zones?.map((zone: IZone) => (
//           <Droppable key={zone.id} droppableId={zone.id}>
//             {(provided, snapshot) => (
//               <ResizePanel direction="e">
//                 <div
//                   // node est l'élément DOM que l'on veut observer, à savoir la zone que l'on resize, voir la doc de ResizeObserver
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
//                   className={`flex flex-col justify-center items-center min-h-[100px] w-[400px] border-2 ${
//                     snapshot.isDraggingOver
//                       ? "bg-green-100"
//                       : "border-dashed border-gray-500"
//                   } p-4 relative m-2 min-w-[150px] max-w-[430px]`}
//                 >
//                   {zone.moduleType === "texte" && (
//                     <textarea
//                       className="w-full h-40 p-4 border-2 border-gray-300"
//                       value={zone.content ? zone.content : ""}
//                       placeholder="YOUR TEXT HERE"
//                       onChange={(e) =>
//                         handleTextChange(
//                           e,
//                           arrayToIterate.zones,
//                           zone.id,
//                           arrayToIterate.key
//                         )
//                       }
//                     ></textarea>
//                   )}
//                   {zone.moduleType === "image" && (
//                     <button
//                       onClick={() => fileInputRefs.current[zone.id]?.click()}
//                     >
//                       <Image
//                         src={getImageSrc(zone, "image")}
//                         alt="app preview"
//                         width={40}
//                         height={40}
//                       />
//                       <input
//                         type="file"
//                         hidden
//                         ref={(el) => (fileInputRefs.current[zone.id] = el)}
//                         onChange={(event) =>
//                           createHandleFileChange(zone.id)(
//                             event,
//                             templateToModify.zones,
//                             "templateToModify"
//                           )
//                         }
//                       />
//                     </button>
//                   )}
//                   {zone.moduleType === "logo" && (
//                     <button
//                       onClick={() => fileInputRefs.current[zone.id]?.click()}
//                     >
//                       <Image
//                         src={getImageSrc(zone, "logo")}
//                         alt="app preview"
//                         width={40}
//                         height={40}
//                       />
//                       <input
//                         type="file"
//                         hidden
//                         ref={(el) => (fileInputRefs.current[zone.id] = el)}
//                         onChange={(event) =>
//                           createHandleFileChange(zone.id)(
//                             event,
//                             templateToModify.zones,
//                             "templateToModify"
//                           )
//                         }
//                       />
//                     </button>
//                   )}
//                   <button
//                     className="absolute top-0 right-0 p-2"
//                     onClick={() =>
//                       removeZone(
//                         templateToModify.zones,
//                         zone.id,
//                         "templateToModify"
//                       )
//                     }
//                   >
//                     ✕
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

// export default TemplateModificationZone;

import React, { useEffect, useRef } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateUtils } from "@/utils/templateUtils";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";

const TemplateModificationZone = ({ draggingItemType, socialModule }) => {
  const {
    templateToModify,
    setTemplateToModify,
    isModalModifyOpen,
    oldSubZonesId,
  } = useTemplate();
  const {
    handleTextChange,
    removeSubZone,
    getImageSrc,
    createHandleFileChange,
    closeModifyModal,
    saveTemplateToModify,
    handleResetZones,
  } = useTemplateUtils();

  const fileInputRefs = useRef({});

  useEffect(() => {
    if (!templateToModify || !templateToModify.zones) {
      return;
    }

    let updatesNeeded = false;

    const zonesWithDndIds = templateToModify.zones.map((zone, zoneIndex) => {
      const zoneNeedsUpdate =
        !zone.dndId || zone.dndId !== `zone-${zoneIndex + 1}`;

      const subZonesWithDndIds = zone.subZones.map((subZone, subZoneIndex) => {
        const subZoneNeedsUpdate =
          !subZone.dndId ||
          subZone.dndId !== `zone-${zoneIndex + 1}-subzone-${subZoneIndex + 1}`;
        if (subZoneNeedsUpdate) {
          updatesNeeded = true;
        }
        return {
          ...subZone,
          order: subZone.order || subZoneIndex + 1,
          dndId: `zone-${zoneIndex + 1}-subzone-${subZoneIndex + 1}`,
        };
      });

      if (zoneNeedsUpdate) {
        updatesNeeded = true;
      }

      return {
        ...zone,
        order: zone.order || zoneIndex + 1,
        dndId: `zone-${zoneIndex + 1}`,
        subZones: subZonesWithDndIds,
      };
    });

    // S'assurer qu'il y ai toujours 3 zones
    while (zonesWithDndIds.length < 3) {
      const newZoneId = zonesWithDndIds.length + 1;
      zonesWithDndIds.push({
        id: `temp-zone-${newZoneId}`,
        order: newZoneId,
        dndId: `zone-${newZoneId}`,
        subZones: [],
      });
      updatesNeeded = true;
    }

    if (updatesNeeded) {
      setTemplateToModify((prevTemplate) => ({
        ...prevTemplate,
        zones: zonesWithDndIds,
      }));
    }
  }, [templateToModify, setTemplateToModify]);

  useEffect(() => {
    console.log(
      `TEMPLATE TO MODIFY IS ----> ${JSON.stringify(templateToModify)}`
    );
  }, [templateToModify]);

  useEffect(() => {
    console.log(`OLD SUB ZONES ID ===`, oldSubZonesId);
  }, [oldSubZonesId]);

  if (!templateToModify || !templateToModify.zones) {
    return <p>Loading template...</p>; // Adjust as necessary for your loading state
  }

  return (
    <>
      <button
        onClick={() => {
          handleResetZones("templateToModify");
        }}
      >
        clean zones
      </button>
      <Modal
        isOpen={isModalModifyOpen}
        onRequestClose={closeModifyModal}
        contentLabel="Enregistrement du template"
      >
        <button
          onClick={closeModifyModal}
          className="absolute top-0 right-0 p-2 text-lg text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold text-center">
          Êtes-vous satisfait de ce template ?
        </h2>
        <div className="flex justify-around mt-4">
          <button
            onClick={() => saveTemplateToModify(templateToModify, "created")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Oui, enregistrer
          </button>
          <button
            onClick={() => saveTemplateToModify(templateToModify, "draft")}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Non, enregistrer en brouillon
          </button>
        </div>
      </Modal>
      <Droppable
        droppableId="all-zones"
        direction="vertical"
        isDropDisabled={draggingItemType !== "zone"}
      >
        {(provided) => (
          <section
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="zones-container flex flex-col w-[65%] p-4 bg-white justify-center mt-10"
          >
            {templateToModify.zones.map((zone, index) => (
              <Draggable
                key={zone.dndId}
                draggableId={zone.dndId}
                index={index}
              >
                {(providedZone, snapshotZone) => (
                  <div
                    ref={providedZone.innerRef}
                    {...providedZone.draggableProps}
                    {...providedZone.dragHandleProps}
                    className={`zone ${
                      snapshotZone.isDragging ? "opacity-50" : ""
                    } flex flex-col gap-2.5 p-5 border-2 border-dashed border-gray-400 mb-5 ${
                      snapshotZone.isDraggingOver ? "bg-pink-100" : "bg-white"
                    }`}
                  >
                    <Droppable
                      droppableId={zone.dndId}
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
                                key={subZone.dndId} // Ensure key is a string
                                draggableId={subZone.dndId} // Convert ID to string
                                index={subIndex}
                              >
                                {(providedSubZone, snapshotSubZone) => (
                                  <div
                                    ref={providedSubZone.innerRef}
                                    {...providedSubZone.draggableProps}
                                    {...providedSubZone.dragHandleProps}
                                    className={`subzone flex-1 min-w-[50px] min-h-[100px] border border-dashed border-blue-500 p-2.5 relative flex ${
                                      snapshotSubZone.isDragging
                                        ? "opacity-50"
                                        : ""
                                    }`}
                                  >
                                    <Droppable
                                      droppableId={subZone.dndId} // Convert ID to string
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
                                                  "templateToModify"
                                                )
                                              }
                                              placeholder="Enter text here"
                                              className="textarea w-full h-20"
                                            />
                                          )}
                                          {subZone.moduleType === "image" && (
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
                                                  )(
                                                    event,
                                                    templateToModify.zones,
                                                    "template"
                                                  )
                                                }
                                              />
                                            </button>
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
                                      className="absolute top-0 right-0 p-1 text-lg"
                                      onClick={() =>
                                        removeSubZone(
                                          subZone,
                                          subZone.dndId,
                                          "templateToModify"
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
                              Drop columns here
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

export default TemplateModificationZone;
