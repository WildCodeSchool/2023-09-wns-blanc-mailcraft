import React, { useRef, useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { Droppable } from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateUtils } from "@/utils/templateUtils";
import {
  IZone,
  Template,
} from "@/types/interfaces/template/template-interfaces";
// import avec ssr désactivé car le composant essaie d'accéder au dom depuis le back , composant pour resize
const ResizePanel = dynamic(() => import("react-resize-panel"), { ssr: false });

// custom hook pour placer plusieurs ref, utile pour obtenir la largeur dynamiquement (à ne pas toucher)

const useMergedRef = (...refs) =>
  useCallback((node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    });
  }, []);

const TemplateModificationZone = () => {
  const {
    zones,
    setZones,
    templateToModify,
    setTemplateToModify,
    isModalModifyOpen,
    isModalErrorOpen,
    errorMessage
  } = useTemplate();
  const {
    handleResetZones,
    createHandleFileChange,
    handleTextChange,
    removeZone,
    isModalOpen,
    closeModifyModal,
    closeErrorModal,
    resetZones,
    getImageSrc,
    saveTemplateToModify,
  } = useTemplateUtils();

  const fileInputRefs = useRef({});
  const resizeObservers = useRef(new Map());

  const handleResize = useCallback(
    // callback appelé lors du resize d'une zone, sert à obtenir la width dynamiquement et à la set à la bonne zone
    (zoneId) => (entries) => {
      const entry = entries[0];
      const newWidth = Math.ceil(entry.contentRect.width).toString();
      console.log(`Resizing zone with ID: ${zoneId}, new width: ${newWidth}px`);

      if (templateToModify) {
        setTemplateToModify((prevTemplate) => {
          const updatedZones = prevTemplate?.zones?.map((zone) =>
            zone.id === zoneId && zone.size !== newWidth
              ? { ...zone, size: newWidth }
              : zone
          );
          return { ...prevTemplate, zones: updatedZones };
        });
      }
    },

    [setTemplateToModify] // à changer plus tard pour mieux gérer le re render
  );

  useEffect(() => {
    return () => {
      resizeObservers.current.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section
      className={`bg-white flex flex-col justify-center items-end w-[40%] h-[85dvh] border border-gray-300 p-2 my-4 shadow-lg`}
    >
      <button onClick={() => handleResetZones("templateToModify")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
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

      <div className="w-full h-full flex flex-col justify-center items-center p-4 gap-5 overflow-auto">
        {templateToModify?.zones?.map((zone: IZone) => (
          <Droppable key={zone.id} droppableId={zone.id}>
            {(provided, snapshot) => (
              <ResizePanel direction="e">
                <div
                  // node est l'élément DOM que l'on veut observer, à savoir la zone que l'on resize, voir la doc de ResizeObserver
                  ref={useMergedRef(provided.innerRef, (node) => {
                    if (node) {
                      if (!resizeObservers.current.has(zone.id)) {
                        const resizeHandler = handleResize(zone.id);
                        const observer = new ResizeObserver(resizeHandler);
                        observer.observe(node);
                        resizeObservers.current.set(zone.id, observer);
                      }
                    } else {
                      resizeObservers.current.get(zone.id)?.disconnect();
                      resizeObservers.current.delete(zone.id);
                    }
                  })}
                  {...provided.droppableProps}
                  className={`flex flex-col justify-center items-center min-h-[100px] w-[400px] border-2 ${snapshot.isDraggingOver
                      ? "bg-green-100"
                      : "border-dashed border-gray-500"
                    } p-4 relative m-2 min-w-[150px] max-w-[430px]`}
                >
                  {zone.moduleType === "texte" && (
                    <textarea
                      className="w-full h-40 p-4 border-2 border-gray-300"
                      value={zone.content ? zone.content : ""}
                      placeholder="YOUR TEXT HERE"
                      onChange={(e) =>
                        handleTextChange(
                          e,
                          arrayToIterate.zones,
                          zone.id,
                          arrayToIterate.key
                        )
                      }
                    ></textarea>
                  )}
                  {zone.moduleType === "image" && (
                    <button
                      onClick={() => fileInputRefs.current[zone.id]?.click()}
                    >
                      <Image
                        src={getImageSrc(zone, "image")}
                        alt="app preview"
                        width={40}
                        height={40}
                      />
                      <input
                        type="file"
                        hidden
                        ref={(el) => (fileInputRefs.current[zone.id] = el)}
                        onChange={(event) =>
                          createHandleFileChange(zone.id)(
                            event,
                            templateToModify.zones,
                            "templateToModify"
                          )
                        }
                      />
                    </button>
                  )}
                  {zone.moduleType === "logo" && (
                    <button
                      onClick={() => fileInputRefs.current[zone.id]?.click()}
                    >
                      <Image
                        src={getImageSrc(zone, "logo")}
                        alt="app preview"
                        width={40}
                        height={40}
                      />
                      <input
                        type="file"
                        hidden
                        ref={(el) => (fileInputRefs.current[zone.id] = el)}
                        onChange={(event) =>
                          createHandleFileChange(zone.id)(
                            event,
                            templateToModify.zones,
                            "templateToModify"
                          )
                        }
                      />
                    </button>
                  )}
                  <button
                    className="absolute top-0 right-0 p-2"
                    onClick={() =>
                      removeZone(
                        templateToModify.zones,
                        zone.id,
                        "templateToModify"
                      )
                    }
                  >
                    ✕
                  </button>
                  {provided.placeholder}
                </div>
              </ResizePanel>
            )}
          </Droppable>
        ))}
      </div>
    </section>
  );
};

export default TemplateModificationZone;
