import { useTemplate } from "@/contexts/TemplateContext";
import React from "react";
import Modal from "react-modal";
import Image from "next/image";
import gif from "@/assets/template-page/Animation - 1723478944978.gif";

interface SuccessModalProps {
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message }) => {
  const { creationGifLoading } = useTemplate();

  return (
    <Modal
      isOpen={creationGifLoading}
      contentLabel="Confirmation de création"
      className="bg-white w-1/3 h-1/4 m-auto fixed inset-0 border border-gray-400 rounded-lg flex flex-col justify-center items-center p-5"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <Image
        src={gif}
        alt="Chargement en cours..."
        width={150}
        height={150}
        priority // préchargement
      />
      <div className="text-lg font-semibold text-gray-800 mt-4">{message}</div>
    </Modal>
  );
};

export default SuccessModal;
