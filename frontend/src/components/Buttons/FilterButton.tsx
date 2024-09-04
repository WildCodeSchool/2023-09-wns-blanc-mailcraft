import filterLine from '@/assets/template-page/filter-line.png'
import { useState } from 'react';

type FilterButtonProps = {
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
};

type DropdownItemProps = {
    option: string;
    onClick: () => void;
};

const DropdownItem = ({option, onClick}: DropdownItemProps) => {
    return (
    <li
        key={option}
        onClick={onClick}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
    >
        {option}
    </li>
)};

const FilterButton = ({ onChange, options }: FilterButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClick = (value: string) => {
        onChange({ target : { value } } as React.ChangeEvent<HTMLSelectElement>);
        setIsOpen(!isOpen);
    }

    return (
        <>
            <button
                onClick={toggleDropdown}
                className="h-12 w-12 bg-gray-400 hover:bg-gray-500 border border-gray-300 shadow-sm rounded-md flex justify-center items-center">
                <img src={filterLine.src} className="object-cover" />
            </button>

            {isOpen && (
                <div className="absolute right-10 bottom-44 md:right-20 md:bottom-20 w-36 bg-white rounded-sm shadow-lg border border-gray-200 z-50">
                     <ul>
                        <DropdownItem option="Tous" onClick={() => handleClick('Tous')} />
                        {options.map((option) => (
                            <DropdownItem key={option} option={option} onClick={() => handleClick(option)} />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default FilterButton;