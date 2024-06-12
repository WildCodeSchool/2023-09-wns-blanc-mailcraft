import Image from "next/image";
import RedButton from "../Buttons/Redbutton";
import logo from "@/assets/homepage/logo.png";
import Link from "next/link";

export default function UserPagesNavBar() {
    return (
        <div className="xl:h-[10dvh] flex justify-between items-center py-4 mx-auto border-b border-gray-400">
            {/* Vue mobile */}
            <div className="flex items-center md:hidden">
                <Image
                    src={logo}
                    className="h-[5dvh] w-[30dvw] md:h-[7dvh] md:w-[10dvw] ms-7"
                    alt="Flowbite Logo"
                />
            </div>
            <div className="flex items-center md:hidden">
                <div className="flex ml-auto">
                    <div className="space-x-3 me-7 border border-gray-300 rounded-md">
                        <button
                            data-collapse-toggle="navbar-cta"
                            type="button"
                            className="burger-menu inline-flex justify-center items-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-controls="navbar-cta"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Ouvre le menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Vue desktop */}
            <div className="hidden md:flex justify-between items-center w-full">
                <Image
                    src={logo}
                    className="h-[5dvh] w-[30dvw] md:h-[7dvh] md:w-[10dvw] ms-7"
                    alt="Flowbite Logo"
                />
                <ul className="flex flex-row items-center p-4 md:p-0 md:space-x-20">
                    <li>
                        <Link
                            href="/"
                            className="block py-2 px-3 md:p-0 text-xl text-black hover:underline"
                            aria-current="page"
                        >
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/user/myTemplates"
                            className="block py-2 px-3 md:p-0 text-xl text-black hover:underline"
                            aria-current="page"
                        >
                            Mes projets
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/user/myTemplates"
                            className="block py-2 px-3 md:p-0 text-xl text-black hover:underline"
                            aria-current="page"
                        >
                            Aide
                        </Link>
                    </li>
                </ul>
                <div className="me-7">
                    <RedButton
                        text="Mon compte"
                        padding={"py-2"}
                        isBold={false}
                        size={"lg"}
                        shadow={"lg"}
                    />
                </div>
            </div>
        </div>
    )
}
