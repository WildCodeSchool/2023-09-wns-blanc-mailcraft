import React from "react";

type RedButtonProps = {
  text: string;
  color: string;
  padding: string;
  isBold: boolean;
  shadow: string;
  size: string;
  link?: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};

const RedButton = ({
  text,
  color,
  padding,
  isBold,
  shadow,
  size,
  link,
  type,
  onClick,
}: RedButtonProps) => {
  const buttonClasses = `${padding} ${
    isBold ? "font-bold" : "font-normal"
  } text-white bg-${color} rounded-xl text-${size} w-full xl:w-[9dvw] shadow-${shadow} hover:bg-red-600`;

  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  );
};

export default RedButton;
