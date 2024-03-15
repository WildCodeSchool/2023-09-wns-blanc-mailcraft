import Link from "next/link";
import logo from "@/assets/homepage/logo.png";
import Image from "next/image";
import { useRouter } from "next/router"; // Import useRouter

interface NavBarProps {
  issignUpPage: boolean; // Spécifier le type boolean pour issignUpPage
}

export default function NavBar({ issignUpPage }: NavBarProps) {
  const router = useRouter();

  return (
    <nav>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-8 mb-10">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            src={logo}
            className="h-[5dvh] w-[30dvw] md:h-[8dvh] md:w-[11dvw]"
            alt="Flowbite Logo"
          />
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link href="/signUp">
            <button
              type="button"
              className="text-white text-md bg-[#E83B4E] hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg px-3 md:px-4 py-2 text-center"
            >
                S&apos;inscrire
            </button>
          </Link>
          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-20 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <Link
                href="/"
                className={!issignUpPage ? "block py-2 px-3 md:p-0 text-lg text-white bg-red-500 rounded md:bg-transparent md:text-red-500 md:text-xl" : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"}
                aria-current="page"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/ressources"
                className={!issignUpPage ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl" : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"}
              >
                Ressources
              </Link>
            </li>
            <li>
              <Link
                href="/prix"
                className={!issignUpPage ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl" : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"}
              >
                Prix
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={!issignUpPage ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl" : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"}
              >
                A propos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}