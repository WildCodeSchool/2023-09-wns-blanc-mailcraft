import { DragDropContext, DropResult } from "react-beautiful-dnd";
import MailArea from "@/components/Mailing/MailArea";
import UserTemplatesList from "@/components/Mailing/userTemplatesList";
import { useContext, useEffect, useState } from "react";
import { MailingContext } from "@/contexts/MailContext";
import axios from "axios";
import NavBar from "@/components/NavBars/HomeNavBar";
import SuccessModal from "@/components/SuccessModal";
import { useAuth } from "@/contexts/AuthContext";
export default function MailingPage() {
  const context = useContext(MailingContext);
  const { user } = useAuth();
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

  const [isLoading, setIsLoading] = useState(true);

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
            { templateZones: template.zones, userLinks: user.socialLinks },
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

  useEffect(() => {
    // Simulate data fetching or other loading operations
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after loading is done
    }, 2000); // Adjust the timeout duration as needed
  }, []);

  // Ajoutez l'état pour gérer la section toggle
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-black"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <section className="w-full md:w-[90%] xl:w-[70%] mx-auto ">
        <NavBar issignUpPage={true} />
      </section>
      <SuccessModal message={"Mail en cours d'envoi..."} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col xl:justify-center md:flex-row w-full mt-10 p-5 space-y-2 md:space-y-0 md:space-x-0">
          <UserTemplatesList
            isSectionOpen={isSectionOpen}
            setIsSectionOpen={setIsSectionOpen}
          />
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
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="30" height="30" fill="customBrown" />
            <path
              d="M7 17L16.8995 7.10051"
              stroke="#FFF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 7.00001L16.8995 16.8995"
              stroke="#FFF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="30" height="30" fill="customBrown" />
            <path
              d="M6 12H18"
              stroke="#FFF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 15.5H18"
              stroke="#FFF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 8.5H18"
              stroke="#FFF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
