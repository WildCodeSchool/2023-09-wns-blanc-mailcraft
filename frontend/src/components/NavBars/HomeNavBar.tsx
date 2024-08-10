import Link from "next/link";
import logo from "@/assets/homepage/logo.png";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import RedButton from "../Buttons/Redbutton";
import { useState } from "react";

interface HomeNavBarProps {
  issignUpPage: boolean;
}

export default function HomeNavBar({ issignUpPage }: HomeNavBarProps) {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logOut = () => {
    router.push("/").then(() => window.location.reload());
    localStorage.removeItem("token");

    setIsAuthenticated(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between border-b border-gray-400 md:border-none py-8 mb-10">
      {/* Vue mobile */}
      <div className="flex items-center md:hidden">
        <Link href="/">
          <Image
            src={logo}
            className="h-[5dvh] w-[30dvw] md:h-[7dvh] md:w-[10dvw] ms-7 md:mr-4"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
              className={`fixed top-16 right-2 left-auto z-50 w-3/5 md:block md:w-auto ${isMenuOpen ? "block" : "hidden"
                }`}
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-300 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                <li>
                  <Link
                    href={isAuthenticated ? "user/myTemplates" : "/signIn"}
                    className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    aria-current="page"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href={isAuthenticated ? "mailing" : "/signIn"}
                    className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    aria-current="page"
                  >
                    Emails
                  </Link>
                </li>
                <li>
                  <Link
                    href={isAuthenticated ? "user/myProfile" : "/signIn"}
                    className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    aria-current="page"
                  >
                    Mon compte
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <button
                      onClick={logOut}
                      className="block py-2 px-3 md:p-0 text-lg text-black rounded md:bg-transparent md:text-red-500 md:text-xl"
                    >
                      Se déconnecter
                    </button>
                  </li>
                )}
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
            className="xl:h-[7dvh] w-[30dvw] md:h-[3dvh] md:w-[10dvw] ms-2"
            alt="Mailcraft Logo"
          />
        </Link>
        <ul className="flex flex-row items-center p-4 md:p-0 md:space-x-20">
          <li>
            <Link
              href={isAuthenticated ? "/user/myTemplates" : "/signIn"}
              className={
                !issignUpPage
                  ? "block py-2 px-3 md:p-0 text-lg text-white bg-red-500 rounded md:bg-transparent md:hover:text-red-500 md:text-xl"
                  : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
              }
              aria-current="page"
            >
              Templates
            </Link>
          </li>
          <li>
            <Link
              href={isAuthenticated ? "mailing" : "/signIn"}
              className={
                !issignUpPage
                  ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                  : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
              }
            >
              Emails
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link
                href="/user/myProfile"
                className={
                  !issignUpPage
                    ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                    : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                }
              >
                Mon Compte
              </Link>
            </li>
          )}
        </ul>

        <div className="me-2">
          {isAuthenticated ? (
            <RedButton
              text="Déconnexion"
              href=""
              onClick={logOut}
              padding={"p-2"}
              isBold={false}
              size={"lg"}
              shadow={"lg"}
            />
          ) : (
            <RedButton
              text="Se connecter"
              href="/signIn"
              padding={"p-2"}
              isBold={false}
              size={"lg"}
              shadow={"lg"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
