import Link from "next/link";
import React from "react";

type RedButtonProps = {
  text: string;
  padding: string;
  isBold: boolean;
  size: string;
  link: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};

const RedButton = ({
  text,
  padding,
  isBold,
  size,
  link,
  type,
  onClick,
}: RedButtonProps) => {
  const buttonClasses = `${padding} ${isBold ? "font-bold" : "font-normal"
    } text-white bg-red-500 rounded-xl text-${size} w-full xl:w-[12dvw] border hover:border-red-500 hover:bg-white hover:text-red-500 transition duration-300`;

  return (
    <Link href={link}>
      <button type={type} className={buttonClasses} onClick={onClick}>
        {text}
      </button>
    </Link>
  );
};

export default RedButton;
