import { ChangeEvent } from "react";

type SearchBarProps = {
    value: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
            <div className="w-3/4 md:w-1/4 relative">
                <input type="search" placeholder="Rechercher un template..." value={value} onChange={onChange} className="w-full h-12 md:h-[7dvh] p-4 rounded-lg bg-gray-300 placeholder-gray-500 text-gray-700 border border-gray-400 shadow-md focus:border-gray-400 focus:ring-0" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </div>
    )
}