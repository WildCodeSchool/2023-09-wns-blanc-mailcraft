import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { MailingContext } from "@/contexts/MailContext";
import {
  DELETE_CONTACT,
  ADD_NEW_CONTACT,
} from "@/client/mutations/mailing/mailing-mutations";
export const useMailingUtils = () => {
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("useMailingUtils must be used within a MailingProvider");
  }

  const {
    contactInputs,
    setContactInputs,
    isModalContactsOpen,
    setIsModalContactsOpen,
    addresses,
    setAddresses,
  } = context;

  const [addContact, { data, loading, error }] = useMutation(ADD_NEW_CONTACT);

  const handleContactInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: string
  ) => {
    const newVal = e.target.value;
    setContactInputs({
      ...contactInputs,
      [label]: newVal,
    });
  };

  const createNewContact = async () => {
    try {
      console.log(`THE INPUTS ARE${JSON.stringify(contactInputs)}`);

      const response = await addContact({
        variables: {
          contactData: contactInputs,
        },
      });
      if (response.data) {
        console.log("Contact created successfully", response.data);
        setContactInputs({
          firstname: "",
          lastname: "",
          email: "",
          profilepic: "",
          userId: 1,
        });
        setIsModalContactsOpen(false);
      }
    } catch (err) {
      console.error("Error creating contact", err);
    }
  };

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    onCompleted: () => {
      console.log("Contact deleted successfully");
    },
  });

  const handleDeleteContact = async (contactId: number) => {
    try {
      await deleteContact({
        variables: { contactId },
      });
    } catch (e) {
      console.error("Failed to delete contact", e);
    }
  };

  const updateListRecipients = (mail: string) => {
    if (!addresses.includes(mail)) {
      setAddresses([...addresses, mail]);
    }
  };

  const removeAddress = (mail: string) => {
    if (typeof mail !== "string") {
      console.error("Invalid type for mail. It should be a string.");
      return;
    }

    if (addresses.includes(mail)) {
      setAddresses(addresses.filter((address) => address !== mail));
    } else {
      console.log("Mail not found in the list.");
    }
  };

  return {
    handleContactInputChange,
    createNewContact,
    handleDeleteContact,
    updateListRecipients,
    removeAddress,
    loading,
    error,
  };
};
