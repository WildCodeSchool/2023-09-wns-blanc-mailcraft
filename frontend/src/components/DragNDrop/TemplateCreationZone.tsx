import React, { useCallback, useEffect, useRef, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateCreationUtils } from "@/utils/templateCreationUtils";
import { useTemplateCommonUtils } from "@/utils/templateCommonUtils";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import { Editor } from "@tinymce/tinymce-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useAuth } from "@/contexts/AuthContext";
import questionMark from "@/assets/template-page/question-mark-circle-svgrepo-com.svg";

const TemplateCreationZone = ({
  draggingItemType,
  socialModule,
  setStartTour,
  isFirstTourCompleted,
}) => {
  const { zones, setZones, isModalErrorOpen, errorMessage, isModalOpen } =
    useTemplate();
  const { saveTemplate } = useTemplateCreationUtils();
  const { user } = useAuth();
  const {
    handleTextChange,
    removeSubZone,
    getImageSrc,
    createHandleFileChange,
    handleResetZones,
    closeErrorModal,
    closeModal,
    resetZones,
  } = useTemplateCommonUtils();

  const fileInputRefs = useRef({});
  const containerRef = useRef(null);
  const [panelSizes, setPanelSizes] = useState({});

  const handleEditorChange = (content, subZoneId) => {
    handleTextChange(content, subZoneId, "template");
  };

  useEffect(() => {
    if (zones.length === 0) {
      setZones([
        { id: "zone-1", dndId: "zone-1", order: 1, subZones: [] },
        { id: "zone-2", dndId: "zone-2", order: 2, subZones: [] },
        { id: "zone-3", dndId: "zone-3", order: 3, subZones: [] },
      ]);
    }
  }, [zones, setZones]);

  useEffect(() => {
    console.log(`New Zones are ${JSON.stringify(zones)}`);
  }, [zones]);

  const handlePanelResize = (id, size) => {
    setPanelSizes((prevSizes) => ({
      ...prevSizes,
      [id]: size.toString(),
    }));

    // Update zones with the new size
    setZones((prevZones) =>
      prevZones.map((zone) => ({
        ...zone,
        subZones: zone.subZones.map((subZone) =>
          subZone.id === id ? { ...subZone, width: size } : subZone
        ),
      }))
    );
  };

  return (
    <>
      {" "}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Enregistrement du template brouillon"
        className="bg-white w-2/5 h-1/4 m-auto fixed inset-0 border border-gray-400 rounded-lg flex flex-col justify-start"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-1 p-2 text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <div className="w-full h-3 rounded-t-lg bg-red-500"></div>
        <div className="flex flex-col justify-center items-center gap-10">
          <h2 className="text-lg font-semibold text-center mt-3">
            Souhaitez-vous plutôt enregistrer ce template en tant que brouillon
            ?
          </h2>
          <div className="flex justify-around gap-8">
            <button
              onClick={() => saveTemplate("draft", user.id)}
              className="px-7 py-2 bg-gray-100 text-black hover:bg-gray-200 rounded border border-gray-300 shadow-md"
            >
              Oui, sauvegarder en tant que brouillon
            </button>
            <button
              onClick={() => resetZones("zones")}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Non, supprimer ce template
            </button>
          </div>
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
            className="zones-container relative flex flex-col w-[60%] p-4 bg-white justify-center mt-7"
          >
            {isFirstTourCompleted && (
              <button
                className="absolute top-2 left-2"
                onClick={() => setStartTour(true)}
                aria-label="Start tour"
              >
                <Image
                  src={questionMark}
                  alt="question mark"
                  width={30}
                  height={50}
                />
              </button>
            )}
            <button
              className="absolute top-2 right-2"
              onClick={() => {
                handleResetZones("template");
              }}
            >
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
                    className={`zone ${
                      snapshotZone.isDragging ? "opacity-50" : ""
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
                          key={`${zone.id}-${zone.order}`}
                          ref={providedSub.innerRef}
                          {...providedSub.droppableProps}
                          className="subzone-container flex gap-2"
                        >
                          <PanelGroup direction="horizontal">
                            {zone.subZones.length > 0 ? (
                              zone.subZones.map((subZone, subIndex) => (
                                <Panel
                                  key={subZone.id}
                                  defaultSize={100 / zone.subZones.length}
                                  minSize={20}
                                  onResize={(size) =>
                                    handlePanelResize(subZone.id, size)
                                  }
                                >
                                  <Draggable
                                    key={subZone.id}
                                    draggableId={subZone.id}
                                    index={subIndex}
                                  >
                                    {(providedSubZone, snapshotSubZone) => (
                                      <div
                                        ref={useCallback(
                                          (node) => {
                                            if (node) {
                                              providedSubZone.innerRef(node);
                                            }
                                          },
                                          [subZone.id]
                                        )}
                                        {...providedSubZone.draggableProps}
                                        {...providedSubZone.dragHandleProps}
                                        className={`subzone flex justify-around items-center flex-1 min-w-[50px] h-[120px] border border-dashed border-blue-500 p-2.5 relative ${
                                          snapshotSubZone.isDragging
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
                                              className="module-container flex justify-center items-center w-full"
                                            >
                                              {!subZone.moduleType && (
                                                <i className="fas fa-plus-circle text-gray-500 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                              )}
                                              {subZone.moduleType ===
                                                "texte" && (
                                                <Editor
                                                  key={`${subZone.id}-${subZone.order}`}
                                                  apiKey={
                                                    process.env
                                                      .NEXT_PUBLIC_TINYMCE_API_KEY
                                                  }
                                                  value={subZone.content || ""}
                                                  onEditorChange={(content) =>
                                                    handleEditorChange(
                                                      content,
                                                      subZone.id
                                                    )
                                                  }
                                                  init={{
                                                    height: 100,
                                                    width: "100%",
                                                    menubar: false,
                                                    toolbar_sticky: false, // test sans vitesse
                                                    statusbar: false,
                                                    branding: false,
                                                    language: "en",
                                                    plugins: [
                                                      "advlist autolink lists link",
                                                      "searchreplace visualblocks code",
                                                      "table paste help wordcount",
                                                    ],
                                                    toolbar:
                                                      "undo redo | bold italic underline | " +
                                                      "forecolor | fontsizeselect | alignleft aligncenter alignright alignjustify | ",
                                                    placeholder:
                                                      "Entrez votre texte ici...",
                                                    content_style:
                                                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } .mce-content-body { width: 100%; height: 100%; border: 0; focus-ring: 0; resize: none; background: transparent; padding: 0; margin: 0; overflow: hidden; }",
                                                  }}
                                                />
                                              )}
                                              {subZone.moduleType ===
                                                "image" && (
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
                                                      width={70}
                                                      height={70}
                                                      className="object-cover h-full w-full max-h-28"
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
                                                          zones,
                                                          "template"
                                                        )
                                                      }
                                                    />
                                                  </button>
                                                </div>
                                              )}
                                              {subZone.moduleType ===
                                                "social" && (
                                                <div className="flex justify-around w-full mt-3">
                                                  {socialModule.map(
                                                    (social) => (
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
                                                    )
                                                  )}
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
                                  {subIndex < zone.subZones.length - 1 && (
                                    <PanelResizeHandle
                                      style={{ cursor: "col-resize" }}
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
