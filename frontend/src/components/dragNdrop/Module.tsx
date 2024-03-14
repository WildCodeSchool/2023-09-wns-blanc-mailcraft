import React from "react";
import Image from "next/image";
// Définir les types des props
type ModuleProps = {
  picture: any;
  title: string;
};

// Définir le composant d'image
const Module = ({ picture,title }: ModuleProps) => {
  return (
    <div className="border border-black h-24 w-24 m-5 border-2 pb-2">
    <Image
    className="mt-5 mb-1 w-3/6 h-3/6  m-auto"
    src={picture}
    alt="Illustration feature"/>

    <div className="text-center">
    <p className="font-bold">{title}</p>
  </div>
  </div>
    
    
    
    );
};

export default Module;
