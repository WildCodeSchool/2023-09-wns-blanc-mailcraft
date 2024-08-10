import React from "react";
import Image from "next/image";

// Définir les types des props
type ModuleProps = {
  picture: any;
  title: string;
};

// Définir le composant d'image
const Module = ({ picture, title }: ModuleProps) => {
  return (
    <div className="flex flex-col justify-center items-center p-3">
      <Image
        className="w-6 h-6 2xl:w-8 2xl:h-8"
        src={picture}
        alt="Illustration feature"
      />
      <div className="text-center">
        <p className="mt-1 font-medium">{title}</p>
      </div>
    </div>
  );
};

export default Module;
