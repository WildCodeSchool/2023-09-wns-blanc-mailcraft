import { createContext, useState, FC, ReactNode } from "react";
import { contactInputs } from "@/types/interfaces/mailing-interfactes.ts/mailing-interface";
interface MailingContextType {
  contactInputs: contactInputs | null;
  setContactInputs: React.Dispatch<React.SetStateAction<contactInputs | null>>;
  isModalContactsOpen: boolean;
  setIsModalContactsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addresses: string[];
  setAddresses: React.Dispatch<React.SetStateAction<string[]>>;
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
    profilepic: "",
    userId: 1,
  });
  const [isModalContactsOpen, setIsModalContactsOpen] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([
    "user@mail.com",
    "user2@mail.com",
  ]);

  return (
    <MailingContext.Provider
      value={{
        contactInputs,
        setContactInputs,
        isModalContactsOpen,
        setIsModalContactsOpen,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </MailingContext.Provider>
  );
};
