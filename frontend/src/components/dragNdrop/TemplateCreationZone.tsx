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
  ArrayToIterate,
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

interface TemplateCreationZoneProps {
  arrayToIterate: ArrayToIterate | null;
}

const TemplateCreationZone: React.FC<TemplateCreationZoneProps> = ({
  arrayToIterate,
}) => {
  const { zones, setZones, templateToModify, setTemplateToModify, template } =
    useTemplate();
  const {
    saveTemplate,
    handleResetZones,
    handleTemplateChange,
    createHandleFileChange,
    handleTextChange,
    getImgPreviewByZoneId,
    removeZone,
    isModalOpen,
    isModalModifyOpen,
    setIsModalModifyOpen,
    closeModifyModal,
    closeModal,
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

      if (arrayToIterate?.key === "templateToModify" && templateToModify) {
        setTemplateToModify((prevTemplate) => {
          const updatedZones = prevTemplate?.zones?.map((zone) =>
            zone.id === zoneId && zone.size !== newWidth
              ? { ...zone, size: newWidth }
              : zone
          );
          return { ...prevTemplate, zones: updatedZones };
        });
      } else if (arrayToIterate?.key === "zones") {
        setZones((prevZones) =>
          prevZones.map((zone) =>
            zone.id === zoneId && zone.size !== newWidth
              ? { ...zone, size: newWidth }
              : zone
          )
        );
      }
    },

    [setZones, setTemplateToModify, arrayToIterate?.key] // à changer plus tard pour mieux gérer le re render
  );

  useEffect(() => {
    return () => {
      resizeObservers.current.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section
      className={`flex flex-col justify-center items-center w-[40%] h-[90vh] border-solid border-2 border-gray-300 p-10 my-4 ${
        arrayToIterate?.key === "templateToModify"
          ? "bg-[#281c64]"
          : "bg-[#5a151d]"
      }`}
    >
      <button
        className="mx-auto w-auto p-2 border-red-950 border-solid border-4 text-white bg-slate-600"
        onClick={() =>
          arrayToIterate?.key === "templateToModify"
            ? // ? saveTemplateToModify(templateToModify)
              setIsModalModifyOpen(true)
            : saveTemplate("created")
        }
      >
        Enregistrer
      </button>
      <button
        className="w-1/2 h-[10%] mb-4"
        onClick={() => handleResetZones(arrayToIterate?.key || "")}
      >
        Clear Zones
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Enregistrer comme brouillon"
      >
        <h2 className="text-lg font-semibold text-center">
          Souhaitez-vous sauvegarder votre template comme brouillon avant de le
          supprimer?
        </h2>
        <div className="flex justify-around mt-4">
          <button
            onClick={() => saveTemplate("draft")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Oui
          </button>
          <button
            onClick={() => resetZones("zones")}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Non
          </button>
        </div>
      </Modal>

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
      <input
        type="text"
        value={
          arrayToIterate?.key === "templateToModify"
            ? templateToModify?.title
            : template?.title
        }
        placeholder="Template Title"
        onChange={(e) => handleTemplateChange(e, arrayToIterate?.key)}
        className="my-5"
      />
      <div className="border-2 border-solid border-gray-950 w-full h-full flex justify-center items-center p-4 bg-[#fff] flex-col gap-5 overflow-auto">
        {arrayToIterate?.zones?.map((zone: IZone) => (
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
                  className={`flex flex-col justify-center items-center min-h-[100px] w-[400px] border-2 ${
                    snapshot.isDraggingOver
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
                            arrayToIterate.zones,
                            arrayToIterate.key
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
                            arrayToIterate.zones,
                            arrayToIterate.key
                          )
                        }
                      />
                    </button>
                  )}
                  <button
                    className="absolute top-0 right-0 p-2"
                    onClick={() =>
                      removeZone(
                        arrayToIterate.zones,
                        zone.id,
                        arrayToIterate.key
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

export default TemplateCreationZone;
