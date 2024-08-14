import defaultIcon from "@/assets/mailing-page/icon.png";
import AddContactModal from "./AddContactModal";
import Image from "next/image";
import { contactData } from "@/types/interfaces/mailing/mailing-interface";
import { useState, useContext } from "react";
import { MailingContext } from "@/contexts/MailContext";
import { GET_USER_CONTACTS } from "@/client/queries/mailing/mailing-queries";
import { useQuery } from "@apollo/client";
import { useMailingUtils } from "@/utils/mailingUtils";
import { useAuth } from "@/contexts/AuthContext";

export default function ContactList() {
  const { user } = useAuth();
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("ContactList.tsx must be used within a MailingProvider");
  }

  const { handleDeleteContact, updateListRecipients } = useMailingUtils();
  const { isModalContactsOpen, setIsModalContactsOpen } = context;
  const [contactList, setContactList] = useState<contactData[] | []>([]);

  const { data, loading, error } = useQuery(GET_USER_CONTACTS, {
    variables: { userId: user.id },
    onCompleted: (data) => {
      setContactList(data.getAllUserContacts);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <section className="flex flex-col gap-5 ml-5">
        <button
          type="button"
          onClick={() => setIsModalContactsOpen(true)}
          className="text-white py-2 px-4 bg-[#E83B4E] rounded w-[70%] mx-auto"
        >
          Ajouter un Contact
        </button>
        <AddContactModal />
        <section className="flex flex-col items-center w-full bg-pink-100 p-4 mt-4">
          <div className="w-full bg-white rounded-lg shadow-lg p-4 overflow-y-auto h-[500px]">
            <h2 className="text-red-500 mb-4 text-center">LISTE DE CONTACTS</h2>
            {contactList.map((contact, key) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 hover:bg-gray-100 transition-colors duration-300 group"
              >
                <div className="flex items-center">
                  <Image
                    src={contact.profilepic || { defaultIcon }}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <p className="ml-4 mr-6 flex-1">{contact.email}</p>{" "}
                </div>
                <div className="flex">
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2"
                    onClick={() => {
                      updateListRecipients(contact.email);
                    }}
                  >
                    <i className="fas fa-pen text-blue-500 text-lg"></i>
                  </button>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => {
                      handleDeleteContact(contact.id);
                    }}
                  >
                    <i className="fas fa-trash-alt text-red-500 text-lg"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
