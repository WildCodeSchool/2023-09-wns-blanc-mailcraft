import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { MailingContext } from "@/contexts/MailContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DELETE_CONTACT,
  ADD_NEW_CONTACT,
} from "@/client/mutations/mailing/mailing-mutations";
import axios from "axios";
import { useTemplate } from "@/contexts/TemplateContext";
export const useMailingUtils = () => {
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("useMailingUtils must be used within a MailingProvider");
  }
  const { setCreationGifLoading } = useTemplate();
  const {
    contactInputs,
    setContactInputs,
    isModalContactsOpen,
    setIsModalContactsOpen,
    addresses,
    setAddresses,
    setMailSubject,
    setRecipient,
    mailSubject,
    recipient,
    htmlTemplateContent,
  } = context;

  const { user } = useAuth();

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
          userId: user.id,
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

  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setRecipient(value);
  };

  const handleMailSubjectChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setMailSubject(value);
  };
  const sendEmail = async () => {
    if (!recipient.length || !mailSubject || !htmlTemplateContent) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      setCreationGifLoading(true);
      const response = await axios.post("http://localhost:5050/sendMail", {
        userMail: user.email,
        recipient: recipient,
        subject: mailSubject,
        htmlContent: htmlTemplateContent,
      });

      if (response.status === 200) {
        setCreationGifLoading(false);
      } else {
        alert("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  return {
    handleContactInputChange,
    createNewContact,
    handleDeleteContact,
    updateListRecipients,
    removeAddress,
    handleMailSubjectChange,
    handleRecipientChange,
    sendEmail,
    loading,
    error,
  };
};
