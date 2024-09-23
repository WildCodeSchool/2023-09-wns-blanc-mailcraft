import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { useState } from "react";
import { downloadHtmlTemplate } from "@/utils/templateConversionUtils";
import { useTemplateModificationUtils } from "@/utils/templateModificationUtils";
import { useAuth } from "@/contexts/AuthContext";

interface ActionPanelTemplateCardProps {
  templateId: number;
  templateTitle: string;
  templateZones: any;
  templateStatus: string;
  showDataPanel: boolean;
  onTogglePanel?: () => void;
}

const ActionPanelTemplateCard: React.FC<ActionPanelTemplateCardProps> = ({
  templateId,
  templateTitle,
  templateZones,
  templateStatus,
  showDataPanel,
  onTogglePanel,
}) => {
  const router = useRouter();
  const { deleteTemplate } = useTemplateModificationUtils();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user } = useAuth();
  const handleDelete = async () => {
    await deleteTemplate(templateId);
    router.reload();
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const isDraftsPage = router.pathname.endsWith("/user/myTemplatesDrafts");

  return (
    <div className="action-panel h-[90%] w-12 xl:w-16 bg-[#9F3D3D] flex flex-col rounded-s-md relative">
      <div className="flex justify-center md:justify-start items-start p-2 relative">
        <button
          className={`text-white hover:text-gray-300 rounded-full relative group ${showDataPanel ? "bg-[#7F1D1D]" : "bg-transparent"
            }`}
          onClick={onTogglePanel}
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
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <span className="tooltip z-50">Informations sur le template</span>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-12 mb-3 flex-grow">
        <Link href={`/template/modification/${templateId}`}>
          <button className="mb-2 text-white hover:text-gray-300 relative group">
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            <span className="tooltip z-50">Modifier le template</span>
          </button>
        </Link>
        {!isDraftsPage && (
          <>
            <Link href="/mailing">
              <button className="mb-2 text-white hover:text-gray-300 relative group">
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <span className="tooltip z-50">Envoyer un email</span>
              </button>
            </Link>
            <button
              className="mb-2 text-white hover:text-gray-300 relative group"
              onClick={() =>
                downloadHtmlTemplate(
                  templateTitle,
                  templateZones,
                  user.socialLinks
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v10m0 0l-3.5-3.5m3.5 3.5L15.5 9.5M5.25 15.75h13.5"
                />
              </svg>
              <span className="tooltip z-50">Télécharger le template</span>
            </button>
          </>
        )}
        <button
          className="mb-2 text-white hover:text-gray-300 relative group"
          onClick={openModal}
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
          <span className="tooltip z-50">Supprimer le template</span>
        </button>
      </div>

      <Modal
        className="bg-white w-2/5 h-1/4 m-auto fixed inset-0 border border-gray-400 rounded-lg flex flex-col justify-center items-center p-4 z-50"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation de suppression"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <h2 className="text-lg font-semibold mb-4">
          Êtes-vous sûr de vouloir supprimer ce template ?
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
          >
            Oui
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
          >
            Non
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ActionPanelTemplateCard;
