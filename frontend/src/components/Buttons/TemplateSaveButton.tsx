import { useTemplate } from "@/contexts/TemplateContext";
import { TemplateNavBarProps } from "@/types/interfaces/props/template-navbar-props";
import { useTemplateCreationUtils } from "@/utils/templateCreationUtils";
import { useRouter } from "next/router";

const TemplateSaveButton = ({
  saveButtonColor,
  saveButtonHoverColor,
  arrayToSave,
}: TemplateNavBarProps) => {
  const { saveTemplate } = useTemplateCreationUtils();
  const { setIsModalModifyOpen } = useTemplate();
  const buttonClasses = `px-6 py-2 text-white bg-${saveButtonColor} hover:bg-${saveButtonHoverColor} rounded-xl text-md w-full xl:w-[9vw] shadow-lg`;
  const router = useRouter();

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={() => {
        if (arrayToSave === "templateToModify") {
          setIsModalModifyOpen(true);
        } else {
          saveTemplate("created");
          router.push("/myTemplates");
        }
      }}
    >
      <p className="text-red-500">Terminer</p>
    </button>
  );
};

export default TemplateSaveButton;
