import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import RedButton from "./Buttons/Redbutton";
import { useAuth } from "@/contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import builderImage from "@/assets/homepage/builder.jpg";
import Link from "next/link";

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
      localStorage.setItem("token", data.signIn);
      setIsAuthenticated(true);
      router.push("/");
      // Après la connexion, récupérer les informations de l'utilisateur
      window.location.reload(); // Recharger la page pour déclencher l'effet de useEffect dans AuthContextProvider
    },
  });

  return (
    <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
      <div className="pt-6 w-full flex flex-col flex-wrap items-center">
        <h2 className="text-2xl mb-10">Connectez-vous</h2>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Adresse mail"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
          />
        </div>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Mot de passe"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
          />
        </div>
        <button
          className="flex items-center"
          onClick={() => setShowResetPassword(true)}
        >
          <p>Mot de passe oublié ?</p>
        </button>
        <div className="mb-6">
          <RedButton
            text="Connexion"
            color="red-500"
            padding={"p-3"}
            shadow="0"
            isBold={false}
            size={"lg"}
            onClick={() => signIn()}
            type="submit"
          />
        </div>
      </div>
      <div className="flex items-center">
        <Link href="/signUp">Pas de compte ? Inscrivez-vous.</Link>
      </div>
      <div className="absolute z-[-1] bottom-20 left-20 transform rotate-[-20deg]">
        <Image src={emailSender} alt="import" width={600} height={200} />
      </div>
      <div className="absolute z-[-2] bottom-20 right-20 transform">
        <Image src={builderImage} alt="import" width={600} height={200} />
      </div>
    </div>
  );
}
