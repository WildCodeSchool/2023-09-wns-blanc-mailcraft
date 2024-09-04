import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import RedButton from "@/components/Buttons/Redbutton";
import { useAuth } from "@/contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import builderImage from "@/assets/homepage/builder.jpg";

const SIGN_IN = gql`
  mutation SignIn($password: String!, $email: String!) {
    signIn(password: $password, email: $email)
  }
`;

export default function SignInForm({ setShowResetPassword }) {
  const { setIsAuthenticated, setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const [signIn] = useMutation(SIGN_IN, {
    variables: {
      email,
      password,
    },
    onCompleted(data: any) {
      // Après la connexion, récupérer les informations de l'utilisateur
      // Recharger la page pour déclencher l'effet de useEffect dans AuthContextProvider
      window.location.reload();
      router.push("/");
      localStorage.setItem("token", data.signIn);
      setIsAuthenticated(true);
    },
    onError(error) {
      setError("Les informations ne sont pas valides. Veuillez réessayer.");
    },
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn({ variables: { email, password } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
      <div className="w-full max-w-lg flex flex-col items-center">
        <h2 className="font-bold text-2xl mb-10">Connectez-vous</h2>

        <div className="form-control w-full mb-6 flex flex-col sm:flex-row justify-center items-center">
          <label
            htmlFor="email"
            className="font-semibold w-5/6 sm:w-2/4 text-left sm:text-right pr-4"
          >
            Adresse mail :
          </label>
          <input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="johndoe@gmail.com"
            required
            className="shadow-md input input-bordered w-5/6 sm:w-3/4 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
          />
        </div>

        <div className="form-control w-full mb-6 flex flex-col sm:flex-row justify-center items-center relative">
          <label
            htmlFor="password"
            className="font-semibold w-5/6 sm:w-2/4 text-left sm:text-right pr-4"
          >
            Mot de passe :
          </label>
          <div className="relative w-5/6 sm:w-3/4 xl:w-[77%]">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              required
              aria-describedby="helper-text-explanation"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="***********"
              className="shadow-md input input-bordered w-full rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6 pr-10"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Edit / Show">
                    <g id="Vector">
                      <path
                        d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z"
                        stroke="#000000"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                </svg>
              ) : (
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Edit / Hide">
                    <path
                      id="Vector"
                      d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113"
                      stroke="#000000"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-2 italic">{error}</p>}

        <div className="mb-4 flex flex-col">
          <RedButton
            text="Connexion"
            color="red-500"
            padding={"p-3"}
            shadow="lg"
            isBold={false}
            size={"lg"}
            onClick={() => signIn()}
            type="submit"
          />
          <button className="mb-3" onClick={() => setShowResetPassword(true)}>
            <p
              id="helper-text-explanation"
              className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
              Mot de passe oublié ?
            </p>
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <a href="/signUp" className="text-sm italic hover:underline">
          Pas de compte ? Inscrivez-vous.
        </a>
      </div>
      {/* Div visible uniquement sur les écrans mobiles */}
      <div className="md:hidden  bottom-1">
        <Image src={emailSender} alt="email sender" width={280} height={200} />
      </div>

      {/* Div visible uniquement sur les écrans plus grands */}
      <div className="hidden md:block absolute z-[-1] bottom-40 left-20 transform rotate-[-20deg]">
        <Image src={emailSender} alt="email sender" width={280} height={200} />
      </div>
      <div className="hidden md:block absolute z-[-1] bottom-40 right-20 transform rotate-[10deg]">
        <Image src={builderImage} alt="import" width={280} height={200} />
      </div>
    </div>
  );
}
