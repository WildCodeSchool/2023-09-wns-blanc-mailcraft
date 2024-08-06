import React, { useEffect, useRef, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateModificationUtils } from "@/utils/templateModificationUtils";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const TemplateModificationZone = ({ draggingItemType, socialModule }) => {
  const {
    templateToModify,
    setTemplateToModify,
    isModalModifyOpen,
    isModalErrorOpen,
    errorMessage,
  } = useTemplate();

  const { saveTemplateToModify, closeModifyModal } =
    useTemplateModificationUtils();

  const {
    handleTextChange,
    removeZone,
    closeErrorModal,
    resetZones,
    removeSubZone,
    getImageSrc,
    createHandleFileChange,
    handleResetZones,
    handleAddSubZone // Ensure this function is available
  } = useTemplateCommonUtils();

  const closeAllModals = () => {
    closeErrorModal();
    closeModifyModal();
  };

  const fileInputRefs = useRef({});
  const [panelSizes, setPanelSizes] = useState({});
  const containerRef = useRef(null);

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
          width: subZone.width || '100'
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

  const handlePanelResize = (id, size) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const percentage = (size / containerWidth) * 100;

      setPanelSizes((prevSizes) => ({
        ...prevSizes,
        [id]: percentage.toFixed(2),
      }));

      setTemplateToModify((prevTemplate) => ({
        ...prevTemplate,
        zones: prevTemplate.zones.map((zone) => ({
          ...zone,
          subZones: zone.subZones.map((subZone) =>
            subZone.dndId === id
              ? { ...subZone, width: percentage.toFixed(2) }
              : subZone
          ),
        })),
      }));
    }
  };

  if (!templateToModify || !templateToModify.zones) {
    return <p>Loading template...</p>; // Adjust as necessary for your loading state
  }

  return (
    <>
      <Modal
        isOpen={isModalModifyOpen}
        onRequestClose={closeModifyModal}
        contentLabel="Enregistrement du template"
        className="bg-white w-2/5 h-1/4 m-auto fixed inset-0 border border-gray-400 rounded-lg flex flex-col justify-start"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      >
        <button
          onClick={closeModifyModal}
          className="absolute top-2 right-1 p-2 text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <div className="w-full h-3 rounded-t-lg bg-red-500"></div>
        <div className="flex flex-col justify-center items-center gap-10">
          <h2 className="text-lg font-semibold text-center mt-3">
            Êtes-vous satisfait de ce template ?
          </h2>
          <div className="flex justify-around gap-8">
            <button
              onClick={() => saveTemplateToModify(templateToModify, "created")}
              className="px-7 py-2 bg-gray-100 text-black hover:bg-gray-200 rounded border border-gray-300 shadow-md"
            >
              Oui
            </button>
            <button
              onClick={handleResetZones}
              className="px-7 py-2 bg-gray-100 text-black hover:bg-gray-200 rounded border border-gray-300 shadow-md"
            >
              Non
            </button>
          </div>
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
          &times;
        </button>
        <div className="flex flex-col justify-center items-center gap-10">
          <h2 className="text-lg font-semibold text-center mt-3">{errorMessage}</h2>
          <button
            onClick={closeErrorModal}
            className="px-7 py-2 bg-gray-100 text-black hover:bg-gray-200 rounded border border-gray-300 shadow-md"
          >
            OK
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
            ref={(el) => {
              provided.innerRef(el);
              containerRef.current = el;
            }}
            {...provided.droppableProps}
            className="zones-container relative flex flex-col w-[65%] p-4 bg-white justify-center mt-7"
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
                    className={`zone ${snapshotZone.isDragging ? "opacity-50" : ""
                      } flex flex-col gap-2.5 p-5 border-2 border-dashed border-gray-400 mb-5`}
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
                          <PanelGroup direction="horizontal">
                            {zone.subZones.length > 0 ? (
                              zone.subZones.map((subZone, subIndex) => (
                                <Panel
                                  key={subZone.dndId}
                                  defaultSize={parseFloat(subZone.width)}
                                  minSize={20}
                                  onResize={(size) =>
                                    handlePanelResize(subZone.dndId, size)
                                  }
                                >
                                  <Draggable
                                    key={subZone.dndId}
                                    draggableId={subZone.dndId}
                                    index={subIndex}
                                  >
                                    {(providedSubZone, snapshotSubZone) => (
                                      <div
                                        ref={providedSubZone.innerRef}
                                        {...providedSubZone.draggableProps}
                                        {...providedSubZone.dragHandleProps}
                                        className={`subzone min-w-[50px] min-h-[100px] border border-dashed border-blue-500 p-2.5 relative ${snapshotSubZone.isDragging ? "opacity-50" : ""
                                          }`}
                                      >
                                        <Droppable
                                          droppableId={subZone.dndId}
                                          isDropDisabled={
                                            draggingItemType !== "module"
                                          }
                                        >
                                          {(providedModule) => (
                                            <div
                                              ref={providedModule.innerRef}
                                              {...providedModule.droppableProps}
                                              className="module-container flex justify-center items-center"
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
                                                  placeholder="Entrez votre texte ici..."
                                                  className="w-full h-20 border-0 focus:ring-0 resize-none bg-transparent p-0 m-0 overflow-hidden"
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
                                                        "templateToModify"
                                                      )
                                                    }
                                                  />
                                                </button>
                                              )}
                                              {subZone.moduleType === "social" && (
                                                <div className="flex justify-around w-full mt-4">
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
                                  {subIndex < zone.subZones.length - 1 && (
                                    <PanelResizeHandle
                                      style={{ cursor: 'col-resize' }}
                                    />
                                  )}
                                </Panel>
                              ))
                            ) : (
                              <p className="text-gray-500 text-center flex-grow">
                                Glissez une structure ici
                              </p>
                            )}
                          </PanelGroup>
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
