import { createContext, useState, FC, ReactNode } from "react";
import { contactInputs } from "@/types/interfaces/mailing/mailing-interface";

interface MailingContextType {
  contactInputs: contactInputs | null;
  setContactInputs: React.Dispatch<React.SetStateAction<contactInputs | null>>;
  isModalContactsOpen: boolean;
  setIsModalContactsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addresses: string[];
  setAddresses: React.Dispatch<React.SetStateAction<string[]>>;
  userTemplates: any;
  setUserTemplates: React.Dispatch<React.SetStateAction<any>>;
  selectedTemplate: any;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<any>>;
  templateToSend: any;
  setTemplateToSend: React.Dispatch<React.SetStateAction<any>>;
  htmlTemplateContent: string;
  setHtmlTemplateContent: React.Dispatch<React.SetStateAction<string>>;
  recipient: string;
  setRecipient: React.Dispatch<React.SetStateAction<string>>;
  mailSubject: string;
  setMailSubject: React.Dispatch<React.SetStateAction<string>>;
}

export const MailingContext = createContext<MailingContextType | undefined>(
  undefined
);

interface MailingProviderProps {
  children: ReactNode;
}

export const MailingProvider: FC<MailingProviderProps> = ({ children }) => {
  const [contactInputs, setContactInputs] = useState<contactInputs | null>({
    firstname: "",
    lastname: "",
    email: "",
    profilepic: ""
  });
  const [isModalContactsOpen, setIsModalContactsOpen] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([
    "user@mail.com",
    "user2@mail.com",
  ]);
  const [userTemplates, setUserTemplates] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateToSend, setTemplateToSend] = useState(null);
  const [htmlTemplateContent, setHtmlTemplateContent] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [mailSubject, setMailSubject] = useState<string>("");

  return (
    <MailingContext.Provider
      value={{
        contactInputs,
        setContactInputs,
        isModalContactsOpen,
        setIsModalContactsOpen,
        addresses,
        setAddresses,
        userTemplates,
        setUserTemplates,
        selectedTemplate,
        setSelectedTemplate,
        templateToSend,
        setTemplateToSend,
        htmlTemplateContent,
        setHtmlTemplateContent,
        recipient,
        setRecipient,
        mailSubject,
        setMailSubject,
      }}
    >
      {children}
    </MailingContext.Provider>
  );
};
