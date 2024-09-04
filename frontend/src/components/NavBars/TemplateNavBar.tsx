import Image from "next/image";
import TemplateHeaderButton from "../Buttons/TemplateHeaderButton";
import logo from "@/assets/homepage/logo.png";
import { useTemplate } from "@/contexts/TemplateContext";
import { useTemplateCreationUtils } from "@/utils/templateCreationUtils";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface TemplateNavBarProps {
  arrayToIterate: string;
}

const TemplateNavBar: React.FC<TemplateNavBarProps> = ({ arrayToIterate }) => {
  const router = useRouter();
  const { user } = useAuth();
  const isTemplateToModify = arrayToIterate === "templateToModify";
  const saveButtonColor = isTemplateToModify ? "#766060" : undefined;
  const saveButtonHoverColor = isTemplateToModify ? "#5F4D4D" : undefined;
  const { setIsModalModifyOpen } = useTemplate();
  const { saveTemplate } = useTemplateCreationUtils();

  const handleClick = async () => {
    if (isTemplateToModify) {
      setIsModalModifyOpen(true);
    } else {
      saveTemplate("created", user.id);
    }
  };

  return (
    <div className="h-[10vh] bg-white flex justify-between items-center border-b border-gray-400">
      <Link href="/">
        <Image
          src={logo}
          className="h-[5vh] w-[30vw] md:h-[7vh] md:w-[10vw] ms-7"
          alt="Mailcraft Logo"
        />
      </Link>
      <TemplateHeaderButton
        link="/user/myTemplates"
        text="Mes templates"
        svgIcon="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
      <TemplateHeaderButton
        link="/user/myTemplatesDrafts"
        text="Mes brouillons"
        svgIcon="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
      />
      <div className="me-7">
        <button
          type="button"
          className={`px-6 py-2 text-white rounded-xl text-md w-full xl:w-[9vw] shadow-lg ${
            isTemplateToModify
              ? "bg-[#766060] hover:bg-[#5F4D4D]"
              : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={handleClick}
        >
          Terminer
        </button>
      </div>
    </div>
  );
};

export default TemplateNavBar;
