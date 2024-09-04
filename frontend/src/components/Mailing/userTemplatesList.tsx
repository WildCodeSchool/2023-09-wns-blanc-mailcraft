import { GET_ALL_USER_CREATED_TEMPLATE } from "@/client/queries/template/template-queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { MailingContext } from "@/contexts/MailContext";
import { useAuth } from "@/contexts/AuthContext";

const UserTemplatesList: React.FC<{ isSectionOpen: boolean, setIsSectionOpen: (isOpen: boolean) => void }> = ({ isSectionOpen, setIsSectionOpen }) => {
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

  const { user } = useAuth();
  const [isModalPreviewOpen, setIsPreviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error } = useQuery(GET_ALL_USER_CREATED_TEMPLATE, {
    variables: { userId: user.id },
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

  const filteredTemplates = (userTemplates || [])
    .filter(template => template.zones && template.zones.length > 0)
    .filter(template => template.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading templates</p>;

  return (
    <section className={`xl:mx-10 bg-customBrown p-5 rounded-lg shadow-xl border border-gray-200 w-96 ${isSectionOpen ? 'block' : 'hidden'} md:block w-80 mx-auto`}>
      <h1 className="font-bold text-center mb-5 text-white">MES TEMPLATES</h1>
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Rechercher templates..."
          className="w-4/5 p-2 mb-5 border border-gray-300 rounded focus:border-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Droppable droppableId="userTemplates">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {filteredTemplates && filteredTemplates.length > 0 ? (
              filteredTemplates.map((template, index) => (
                <Draggable
                  key={template.id}
                  draggableId={template.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="mb-3 p-3 bg-white rounded flex justify-between items-center cursor-pointer shadow-custom ease-in-out transform hover:scale-105 transition duration-500"
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
                      <span className="font-medium pr-2">
                        {template.title} |{' '}
                        {new Date(template.creationDate).toLocaleDateString()}
                      </span>
                      <button onClick={() => openModal(template)}>
                        <svg width="20px" height="20px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#494c4e" d="M17.707 16.288l-3.43-3.43a4.47 4.47 0 1 0-1.418 1.42l3.43 3.43a1 1 0 1 0 1.417-1.42zM8 10.478a2.48 2.48 0 1 1 2.48 2.48A2.48 2.48 0 0 1 8 10.48z"/>
                          <path fill="#494c4e" d="M10 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h6.1a6.53 6.53 0 0 1-2.587-3H3a1 1 0 0 1 0-2h1.034C4.02 10.825 4 10.654 4 10.478A6.447 6.447 0 0 1 4.177 9H3a1 1 0 0 1 0-2h2.022a6.526 6.526 0 0 1 2.014-2H3a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1 .913.913 0 0 1-.038.187A6.437 6.437 0 0 1 10.478 4c.176 0 .348.013.52.026V1A1 1 0 0 0 10 0z"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p>Aucune template trouvée</p>
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
        className="w-[80%] xl:w-[40%]  mx-auto  xl:mt-9"
      >
        <h2 className="mt-8 text-lg font-bold mb-4 text-center">{selectedTemplate.title}</h2>
        <div className="xl:mt-8 flex justify-center bg-customBrown border-2 border-customBrown py-6 px-6 rounded-lg lg:overflow-y-auto"
        style={window.innerWidth < 768 ? { maxHeight: '70vh', overflowY: 'auto' } : {}}
        >
        <div 
  className="h-fit w-full sm:w-[90%] md:w-[70%] text-sm sm:text-xs border border-gray-300 p-4 bg-white shadow-lg"
  style={{ 
    width: '100%', 
    padding: '1rem', 
    '@media (min-width: 640px)': { 
      width: '50%', 
      padding: '1.5rem' 
    },
    '@media (min-width: 768px)': { 
      width: '50%', 
      padding: '2rem' 
    } 
  }}
>
{selectedTemplate.zones.map((zone) => (
  <div key={zone.id} className="mb-1">
    <div className={`flex ${zone.subZones.length > 1 ? 'justify-between' : ''}`}>
      {zone.subZones.map((subZone) => (
        <div
          key={subZone.id}
          className={`mb-1 ${zone.subZones.length === 1 ? 'w-full' : 'flex-1'}`}
        >
          {subZone.moduleType === "texte" && (
            <div
              className="xl:text-sm sm:text-xs md:text-xs"
              dangerouslySetInnerHTML={{ __html: subZone.content }}
            ></div>
          )}
          {subZone.moduleType === "image" && (
            <img
              src={subZone.content}
              alt="Template Image"
              className="max-w-[95%] h-36 xl:ml-5"
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
  </div>
))}

          </div>
        </div>
        <button onClick={closeModal}
         className="mt-4 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 flex items-center shadow-lg mx-auto"
        >
        <span className="mr-2">Fermer</span>

<svg className="mt-1" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#FFFF"/></svg>

        </button>
      </Modal>
      )}
    </section>
  );
};

export default UserTemplatesList;
