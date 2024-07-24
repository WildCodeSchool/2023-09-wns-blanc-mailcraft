import Link from "next/link";
import { downloadHtmlTemplate } from "@/utils/templateConversionUtils";
import { useTemplateModificationUtils } from "@/utils/templateModificationUtils";
import { useRouter } from "next/router"


interface ActionPanelTemplateCardProps {
    templateId: number;
    templateTitle: string;
    templateZones: any;
    templateStatus: string;
    showDataPanel: boolean;
    onTogglePanel?: () => void;
}

const ActionPanelTemplateCard: React.FC<ActionPanelTemplateCardProps> = ({ templateId, templateTitle, templateZones, templateStatus, showDataPanel, onTogglePanel }) => {
    const router = useRouter();
    const { deleteTemplate } = useTemplateModificationUtils();

    const handleDelete = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
            await deleteTemplate(templateId);
            router.reload();
        }
    };

    return (
        <div className="action-panel h-[90%] w-12 xl:w-16 bg-[#9F3D3D] flex flex-col rounded-s-md">
            <div className="flex justify-center md:justify-start items-start p-2">
                <button className={`text-white hover:text-gray-300 rounded-full ${showDataPanel ? 'bg-[#7F1D1D]' : 'bg-transparent'}`} onClick={onTogglePanel}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                </button>
            </div>
            <div className={`flex flex-col items-center justify-center ${templateStatus === "created" ? "gap-12" : "gap-24"} mb-3 flex-grow`}>
                <Link href={`/template/modification/${templateId}`}>
                    <button className="mb-2 text-white hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                </Link>
                {templateStatus === "created" && (
                    <>
                        <button className="mb-2 text-white hover:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </button>
                        <button className="mb-2 text-white hover:text-gray-300" onClick={() =>
                            downloadHtmlTemplate(templateTitle, templateZones)
                        }>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v10m0 0l-3.5-3.5m3.5 3.5L15.5 9.5M5.25 15.75h13.5" />
                            </svg>
                        </button>
                    </>
                )}
                <button className="mb-2 text-white hover:text-gray-300" onClick={() =>
                    handleDelete()
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>

    );
}

export default ActionPanelTemplateCard;
