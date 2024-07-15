import { MailingContext } from "@/contexts/MailContext";
import { useContext, useState } from "react";
import { useMailingUtils } from "@/utils/mailingUtils";
import { Droppable } from "react-beautiful-dnd";
import Modal from "react-modal";
import { downloadHtmlTemplate } from "@/utils/templateConversionUtils";

interface MailAreaProps {
  templateToSend: any;
  htmlTemplateContent: string;
}

export default function MailArea({
  templateToSend,
  htmlTemplateContent,
}: MailAreaProps) {
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("ContactList.tsx must be used within a MailingProvider");
  }
  const { addresses } = context;
  const { handleMailSubjectChange, handleRecipientChange, sendEmail } =
    useMailingUtils();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col bg-pink-100 h-full w-[40%] mr-20 mt-10">
      <div className="bg-red-500 text-white text-center py-2 text-lg font-semibold">
        Nouveau Message
      </div>
      <div className="flex flex-col bg-white rounded-b-lg shadow p-6">
        <div className="flex flex-col mb-4">
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700"
          >
            To :
          </label>
          <input
            type="text"
            id="recipient"
            onChange={(e) => handleRecipientChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Objet :
          </label>
          <input
            type="text"
            id="subject"
            onChange={(e) => handleMailSubjectChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Droppable droppableId="templateHtml">
          {(provided) => (
            <div
              id="templateHtml"
              className="relative flex justify-center items-center h-40 border border-gray-300 rounded-md overflow-hidden"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {templateToSend ? (
                <div className="relative border border-gray-300 rounded-md p-2 bg-gray-50 w-full h-full overflow-y-auto hover:bg-gray-200 transition duration-300 ease-in-out">
                  <div className="max-h-full text-sm">
                    {templateToSend.zones.map((zone) => (
                      <div key={zone.id} className="mb-1">
                        {zone.subZones.map((subZone) => (
                          <div key={subZone.id} className="mb-1">
                            {subZone.moduleType === "texte" && (
                              <p className="truncate">{subZone.content}</p>
                            )}
                            {subZone.moduleType === "image" && (
                              <img
                                src={subZone.content}
                                alt="Template Image"
                                className="max-w-full h-16"
                              />
                            )}
                            {subZone.moduleType === "social" && (
                              <a
                                href={subZone.content}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/path/to/social/icon.png"
                                  alt="Social Icon"
                                  className="w-4 h-4"
                                />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 bg-gray-600 bg-opacity-50 transition duration-300 ease-in-out">
                    <button className="text-white text-4xl" onClick={openModal}>
                      <i className="fas fa-search"></i>{" "}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="text-blue-600 hover:text-blue-800 text-4xl"
                  onClick={() => alert("Ouvrir Template")}
                >
                  <i className="fas fa-plus"></i>
                </button>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="flex justify-end mt-4">
          <div className="w-24 h-12"></div>
          <button
            className="ml-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="button"
            onClick={() => sendEmail()}
          >
            Envoyer
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Template Details"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">
          APERCU DU MAIL
        </h2>
        <div
          dangerouslySetInnerHTML={{ __html: htmlTemplateContent }}
          className="p-4 border border-gray-300 rounded-md"
        ></div>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
        >
          Close
        </button>
      </Modal>
    </section>
  );
}
