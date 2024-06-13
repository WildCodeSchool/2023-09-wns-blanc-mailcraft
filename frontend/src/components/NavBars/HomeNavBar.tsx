import Link from "next/link";
import logo from "@/assets/homepage/logo.png";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

interface HomeNavBarProps {
  issignUpPage: boolean;
}

export default function HomeNavBar({ issignUpPage }: HomeNavBarProps) {
  const router = useRouter();
  const { isAuthentificated, setIsAuthenticated } = useAuth();
  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/").then(() => window.location.reload());
  };
  return (
    <nav>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-8 mb-10">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            src={logo}
            className="h-[5dvh] w-[30dvw] md:h-[8dvh] md:w-[11dvw]"
            alt="Mailcraft Logo"
          />
        </a>
        

        
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-20 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <Link
                href="/"
                className={
                  !issignUpPage
                    ? "block py-2 px-3 md:p-0 text-lg text-white bg-red-500 rounded md:bg-transparent md:text-red-500 md:text-xl"
                    : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                }
                aria-current="page"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/ressources"
                className={
                  !issignUpPage
                    ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                    : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                }
              >
                Ressources
              </Link>
            </li>
            <li>
              {!isAuthentificated ? (
                <Link
                  href="/prix"
                  className={
                    !issignUpPage
                      ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                      : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                  }
                >
                  Prix
                </Link>
              ) : (
                <Link
                  href="/template/creation"
                  className={
                    !issignUpPage
                      ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                      : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                  }
                >
                  Template
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/about"
                className={
                  !issignUpPage
                    ? "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                    : "block py-2 px-3 md:p-0 text-lg text-black rounded hover:bg-gray-100 md:text-black md:hover:bg-transparent md:hover:text-red-500 md:text-xl"
                }
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
