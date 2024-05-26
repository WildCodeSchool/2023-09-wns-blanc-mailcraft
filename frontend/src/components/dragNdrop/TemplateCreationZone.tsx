import React, { useRef, useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { Droppable } from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateUtils } from "@/utils/templateUtils";

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

const TemplateCreationZone = () => {
  const { zones, setZones } = useTemplate();
  const {
    saveTemplate,
    handleResetZones,
    handleTemplateChange,
    createHandleFileChange,
    handleTextChange,
    getImgPreviewByZoneId,
    removeZone,
    isModalOpen,
    closeModal,
    resetZones,
  } = useTemplateUtils();

  const fileInputRefs = useRef({});
  const resizeObservers = useRef(new Map());

  const handleResize = useCallback(
    // callback appelé lors du resize d'une zone, sert à obtenir la width dynamiquement et à la set à la bonne zone

    (zoneId) => (entries) => {
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      console.log(
        `Resizing zone with ID: ${zoneId}, new width: ${Math.ceil(newWidth)}px`
      );
      setZones((prevZones) =>
        prevZones.map((zone) =>
          zone.id === zoneId && zone.size !== newWidth.toString()
            ? { ...zone, size: Math.ceil(newWidth).toString() }
            : zone
        )
      );
    },
    [setZones]
  );

  useEffect(() => {
    return () => {
      resizeObservers.current.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className="flex flex-col justify-center items-center w-[40%] h-[90vh] border-solid border-2 border-gray-300 p-10 bg-[#E83B4E] my-4">
      <button
        className="mx-auto w-auto p-2 border-red-950 border-solid border-4 text-white bg-slate-600"
        onClick={() => saveTemplate("created")}
      >
        Enregistrer
      </button>
      <button className="w-1/2 h-[10%] mb-4" onClick={handleResetZones}>
        Clear Zones
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Save as Draft"
      >
        <h2>
          Souhaitez-vous plutôt sauvegarder votre template comme Brouillon avant
          de le supprimer?
        </h2>
        <button onClick={() => saveTemplate("draft")}>Oui</button>
        <button onClick={resetZones}>Non</button>
      </Modal>
      <input
        type="text"
        placeholder="Template Title"
        onChange={(e) => handleTemplateChange(e)}
        className="my-5"
      />
      <div className="border-2 border-solid border-gray-950 w-full h-full flex justify-center items-center p-4 bg-[#fff] flex-col gap-5 overflow-auto">
        {zones.map((zone) => (
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
                      placeholder="YOUR TEXT HERE"
                      onChange={(e) => handleTextChange(e, zone.id)}
                    ></textarea>
                  )}
                  {zone.moduleType === "image" && (
                    <button
                      onClick={() => fileInputRefs.current[zone.id]?.click()}
                    >
                      <Image
                        src={getImgPreviewByZoneId(zone.id, "image")}
                        alt="app preview"
                        width={40}
                        height={40}
                      />
                      <input
                        type="file"
                        hidden
                        ref={(el) => (fileInputRefs.current[zone.id] = el)}
                        onChange={createHandleFileChange(zone.id)}
                      />
                    </button>
                  )}
                  {zone.moduleType === "logo" && (
                    <button
                      onClick={() => fileInputRefs.current[zone.id]?.click()}
                    >
                      <Image
                        src={getImgPreviewByZoneId(zone.id, "logo")}
                        alt="app preview"
                        width={40}
                        height={40}
                      />
                      <input
                        type="file"
                        hidden
                        ref={(el) => (fileInputRefs.current[zone.id] = el)}
                        onChange={createHandleFileChange(zone.id)}
                      />
                    </button>
                  )}
                  <button
                    className="absolute top-0 right-0 p-2"
                    onClick={() => removeZone(zone.id)}
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
