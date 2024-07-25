import { GET_ALL_USER_CREATED_TEMPLATE } from "@/client/queries/template/template-queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { MailingContext } from "@/contexts/MailContext";

const UserTemplatesList: React.FC = () => {
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("UserTemplatesList must be used within a MailingProvider");
  }
  const {
    userTemplates,
    setUserTemplates,
    selectedTemplate,
    setSelectedTemplate,
  } = context;

  const [isModalPreviewOpen, setIsPreviewModalOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_ALL_USER_CREATED_TEMPLATE, {
    variables: { userId: 1 },
  });

  useEffect(() => {
    if (data) {
      console.log("User Templates retrieved", data.getAllUserCreatedTemplates);
      setUserTemplates(data.getAllUserCreatedTemplates);
    }
  }, [data, setUserTemplates]);

  const openModal = (template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const closeModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading templates</p>;

  return (
    <section>
      <h1>My Templates</h1>
      <Droppable droppableId="userTemplates">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {userTemplates && userTemplates.length > 0 ? (
              userTemplates.map((template, index) => (
                <Draggable
                  key={template.id}
                  draggableId={template.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        margin: "0 0 8px 0",
                        padding: "16px",
                        background: "#f4f4f4",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span>
                        {template.title} |{" "}
                        {new Date(template.creationDate).toLocaleDateString()}
                      </span>
                      <button onClick={() => openModal(template)}>?</button>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p>No templates found</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {selectedTemplate && (
        <Modal
          isOpen={isModalPreviewOpen}
          onRequestClose={closeModal}
          contentLabel="Template Details"
        >
          <h2>{selectedTemplate.title}</h2>
          <p>{new Date(selectedTemplate.creationDate).toLocaleDateString()}</p>
          <div>
            {selectedTemplate.zones.map((zone) => (
              <div key={zone.id}>
                <h3>Zone {zone.order}</h3>
                {zone.subZones.map((subZone) => (
                  <p key={subZone.id}>
                    {subZone.moduleType}: {subZone.content}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </section>
  );
};

export default UserTemplatesList;
