import React from "react";
import { useRouter } from "next/router";

type RedButtonProps = {
  text: string;
  padding: string;
  isBold: boolean;
  shadow: string;
  size: string;
  href: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};

const RedButton = ({
  text,
  padding,
  isBold,
  shadow,
  size,
  href,
  type,
  onClick,
}: RedButtonProps) => {
  const buttonClasses = `${padding} ${
    isBold ? "font-bold" : "font-normal"
  } text-white bg-red-500 rounded-xl text-${size} w-full xl:w-[10dvw] shadow-${shadow} hover:bg-red-600`;

  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      <a href={href}>{text}</a>
    </button>
  );
};

export default RedButton;
