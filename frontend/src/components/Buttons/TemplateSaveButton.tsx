import React from "react";

type TemplateSaveButtonProps = {
    color: string;
    hoverColor: string;
};

const TemplateSaveButton = ({
    color,
    hoverColor
}: TemplateSaveButtonProps) => {
    const buttonClasses = `px-6 py-2 text-white bg-${color} hover:bg-${hoverColor} rounded-xl text-md w-full xl:w-[9dvw] shadow-lg`;

    return (
        <button type="button" className={buttonClasses}>
            Terminer
        </button>
    );
};

export default TemplateSaveButton;
