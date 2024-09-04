import React from "react";
import Modal from "react-modal";
import Image from "next/image";
import { useMailingUtils } from "@/utils/mailingUtils";
import defaultIcon from "@/assets/mailing-page/icon.png";
import { useContext } from "react";
import { MailingContext } from "@/contexts/MailContext";
const ModalContacts = () => {
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("ContactList.tsx must be used within a MailingProvider");
  }

  const { isModalContactsOpen, setIsModalContactsOpen } = context;
  const { handleContactInputChange, createNewContact } = useMailingUtils();
  const [showForm, setShowForm] = React.useState(false);

  const handleToggleForm = () => setShowForm(!showForm);

  return (
    <Modal
      isOpen={isModalContactsOpen}
      onRequestClose={() => setIsModalContactsOpen(false)}
      contentLabel="Ajouter un contact"
      className="p-6 bg-white rounded shadow-lg max-w-md mx-auto mt-20"
    >
      <section>
        <h2 className="text-lg font-semibold text-center mb-4">
          Importer une liste de contact Google
          {/* some import google contact component */}
        </h2>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-center mb-4">
          Importer une liste de contact Outlook
          {/* some import outlook contact component */}
        </h2>
      </section>
      <section className="mb-4">
        <div
          onClick={handleToggleForm}
          className="cursor-pointer flex items-center justify-between bg-gray-200 p-2 rounded-md hover:bg-gray-300"
        >
          <h2 className="text-lg font-semibold">
            Ajouter manuellement un contact :
          </h2>
          <i
            className={`fas ${
              showForm ? "fa-chevron-down" : "fa-chevron-right"
            }`}
          ></i>
        </div>
        {showForm && (
          <div>
            <div className="flex flex-col items-center mt-4">
              <div className="relative w-24 h-24 rounded-full border border-gray-300 mb-4">
                <Image
                  src={defaultIcon}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500">
                  +
                </button>
              </div>
            </div>
            <form className="space-y-4 transition-opacity duration-300 ease-in-out">
              <div className="flex flex-col">
                <label htmlFor="firstname" className="mb-1 font-semibold">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstname"
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    handleContactInputChange(e, "firstname");
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="lastname" className="mb-1 font-semibold">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastname"
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    handleContactInputChange(e, "lastname");
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 font-semibold">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    handleContactInputChange(e, "email");
                  }}
                />
              </div>
              <button
                type="button"
                className="w-full bg-[#E83B4E] text-white py-3 rounded-md hover:bg-[#cf3340]"
                onClick={createNewContact}
              >
                Ajouter un contact
              </button>
            </form>
          </div>
        )}
      </section>
    </Modal>
  );
};

export default ModalContacts;
