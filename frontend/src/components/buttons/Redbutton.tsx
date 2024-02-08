import React from "react";

type RedButtonProps = {
  text: string;
  padding: string;
  isBold: boolean;
  size: string;
  link: string;
};

const RedButton = ({ text, padding, isBold, size, link }: RedButtonProps) => {
  const buttonClasses = `${padding} ${
    isBold ? "font-bold" : "font-normal"
  } text-white bg-red-500 rounded-xl text-${size} w-full xl:w-[9dvw]`;

  return <button className={buttonClasses}>{text}</button>;
};

export default RedButton;
