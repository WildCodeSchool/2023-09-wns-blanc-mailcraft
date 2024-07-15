import { DragDropContext, DropResult } from "react-beautiful-dnd";
import MailArea from "@/components/Mailing/MailArea";
import UserTemplatesList from "@/components/Mailing/userTemplatesList";
import { useContext } from "react";
import { MailingContext } from "@/contexts/MailContext";
import axios from "axios";

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

  return (
    <>
      <h1 className="text-xl text-red-950">
        Bienvenue sur la page d'envoie d'e-mail
      </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <section className="flex justify-between w-full mt-10 bg-pink-100 p-5">
          <UserTemplatesList />
          <MailArea
            templateToSend={templateToSend}
            htmlTemplateContent={htmlTemplateContent}
          />
        </section>
      </DragDropContext>
    </>
  );
}
