import Link from "next/link";
import React from "react";

type TemplateHeaderButtonProps = {
    text: string;
    link: string;
    svgIcon: string
};

const TemplateHeaderButton = ({
    text,
    link,
    svgIcon
}: TemplateHeaderButtonProps) => {

    return (
        <Link
            href={link}
            className="w-60 h-11 bg-white border border-gray-400 shadow-md text-black text-center rounded-md flex items-center hover:bg-gray-100"
        >
            <span className="w-1/5 h-full border-r border-gray-400 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E83B4E" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={svgIcon} />
                </svg>
            </span>
            <span className="flex-grow">
                {text}
            </span>
        </Link>



    );
};

export default TemplateHeaderButton;
