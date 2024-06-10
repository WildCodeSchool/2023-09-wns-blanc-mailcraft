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
    <div className="h-14 w-14 m-5 pb-2">
      <Image
        className="w-[60%] h-[70%] m-auto"
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
