import Image from "next/image";
import RedButton from "../Buttons/Redbutton";
import logo from "@/assets/homepage/logo.png";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function UserPagesNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="xl:h-[10dvh] flex justify-between items-center py-4 mx-auto border-b border-gray-400 w-full bg-white">
      {/* Vue mobile */}
      <div className="flex items-center md:hidden">
        <Link href="/">
          <Image
            src={logo}
            className="h-[5dvh] w-[30dvw] md:h-[7dvh] md:w-[10dvw] ms-7"
            alt="Mailcraft Logo"
          />
        </Link>
      </div>
      <div className="flex items-center md:hidden">
        <div className="flex ml-auto">
          <div className="me-7 border border-gray-300 rounded-md">
            <button
              type="button"
              data-collapse-toggle="navbar-default"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={handleMenuToggle}
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
              className={`fixed top-16 right-2 left-auto z-50 w-3/5 md:block md:w-auto ${
                isMenuOpen ? "block" : "hidden"
              }`}
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-300 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                <li>
                  <Link
                    href="/"
                    className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    aria-current="page"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href={isAuthenticated ? "/user/myProfile" : "/signIn"}
                    className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    aria-current="page"
                  >
                    Mon compte
                  </Link>
                </li>
                <li>
                  <Link
                    href={isAuthenticated ? "/user/myTemplates" : "/signIn"}
                    className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    aria-current="page"
                  >
                    Mes templates
                  </Link>
                </li>
                <li>
                  <Link
                    href={isAuthenticated ? "/user/myTemplatesDrafts" : "/signIn"}
                    className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    aria-current="page"
                  >
                    Mes brouillons
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Vue desktop */}
      <div className="hidden md:flex justify-between items-center w-full">
        <Link href="/">
          <Image
            src={logo}
            className="h-[5dvh] w-[30dvw] md:h-[7dvh] md:w-[10dvw] ms-7"
            alt="Mailcraft Logo"
          />
        </Link>
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
              href="/user/myTemplatesDrafts"
              className="block py-2 px-3 md:p-0 text-xl text-black hover:underline"
              aria-current="page"
            >
              Mes brouillons
            </Link>
          </li>
        </ul>
        <div className="me-7">
          <RedButton
            href={isAuthenticated ? "/user/myProfile" : "/signIn"}
            text="Mon compte"
            padding={"py-2"}
            isBold={false}
            size={"lg"}
            shadow={"lg"}
          />
        </div>
      </div>
    </div>
  );
}
