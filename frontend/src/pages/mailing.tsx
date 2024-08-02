import { DragDropContext, DropResult } from "react-beautiful-dnd";
import MailArea from "@/components/Mailing/MailArea";
import UserTemplatesList from "@/components/Mailing/userTemplatesList";
import { useContext, useState } from "react";
import { MailingContext } from "@/contexts/MailContext";
import axios from "axios";
import NavBar from "@/components/NavBars/HomeNavBar";

export default function MailingPage() {
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("MailingPage must be used within a MailingProvider");
  }

  const {
    userTemplates,
    templateToSend,
    setTemplateToSend,
    setHtmlTemplateContent,
    htmlTemplateContent,
  } = context;

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.droppableId === "templateHtml") {
      const templateId = result.draggableId;
      const template = userTemplates.find(
        (t) => t.id.toString() === templateId
      );
      setTemplateToSend(template);

      if (template && template.zones.length > 0) {
        try {
          const response = await axios.post(
            "http://localhost:5050/convertTemplateToHtmlInline",
            { templateZones: template.zones },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Converted HTML:", response.data.html);
          setHtmlTemplateContent(response.data.html);
        } catch (error) {
          console.error("Error during HTML conversion:", error);
        }
      }
    }
  };

  // Ajoutez l'état pour gérer la section toggle
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <NavBar issignUpPage={true} />

    
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col xl:justify-center md:flex-row w-full mt-10 p-5 space-y-2 md:space-y-0 md:space-x-0">
          <UserTemplatesList isSectionOpen={isSectionOpen} setIsSectionOpen={setIsSectionOpen} />
          <MailArea
            templateToSend={templateToSend}
            htmlTemplateContent={htmlTemplateContent}
          />
        </div>
      </DragDropContext>

      {/* Ajoutez un bouton flottant pour basculer la section en vue téléphone */}
      <button
        className="md:hidden fixed bottom-4 right-4 w-16 h-16 bg-customBrown text-white rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setIsSectionOpen(!isSectionOpen)}
      >
        {isSectionOpen ? (
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="30" height="30" fill="customBrown"/>
          <path d="M7 17L16.8995 7.10051" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 7.00001L16.8995 16.8995" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        ) : (
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="30" height="30" fill="customBrown"/>
          <path d="M6 12H18" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 15.5H18" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 8.5H18" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}
