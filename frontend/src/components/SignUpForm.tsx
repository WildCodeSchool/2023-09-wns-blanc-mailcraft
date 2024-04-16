import { useRouter } from "next/router";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import RedButton from "./buttons/Redbutton";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import importImage from "@/assets/homepage/import.jpg";

export default function SignupForm() {
  type SignUpFormState = {
    pseudo: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role?: string | null;
    subscriptionType?: string | null;
  };

  const [sign_upForm, setSign_upForm] = useState<SignUpFormState>({
    pseudo: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: null,
    subscriptionType: null,
  });

  useEffect(() => {
    console.log(sign_upForm);
  }, [sign_upForm]);

  const router = useRouter();
  const SIGNUP = gql`
    mutation Mutation($userData: UserInput!) {
      signUp(userData: $userData)
    }
  `;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSign_upForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [signup, { data }] = useMutation(SIGNUP, {
    onCompleted(data) {
      router.push("/signIn");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup({
      variables: {
        userData: {
          pseudo: sign_upForm.pseudo,
          firstname: sign_upForm.firstname,
          lastname: sign_upForm.lastname,
          email: sign_upForm.email,
          password: sign_upForm.password,
          role: sign_upForm.role,
          subscriptionType: sign_upForm.subscriptionType,
        },
      },
    });
  };

  return (
    <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
      <form
        className="pt-6 w-full flex flex-col flex-wrap items-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-10">Créer un compte gratuitement</h2>
        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            placeholder="Nom d'utilisateur"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Prénom"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Nom"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Adresse mail"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Mot de passe"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Confirmer le mot de passe"
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
          />
        </div>
        {<p className="text-red-500"></p>}
        <div className="mb-6">
          <RedButton
            text="Je m'inscris !"
            padding={"p-3"}
            isBold={false}
            size={"lg"}
            link={"/"}
            type="submit"
          />
        </div>
      </form>
      <div className="flex items-center">
        <Link href="/signIn">Déjà inscrit ? Connectez-vous.</Link>
      </div>
      <div className="absolute z-[-1] bottom-25 left-20 transform rotate-[-20deg]">
        <Image src={emailSender} alt="import" width={600} height={200} />
      </div>
      <div className="absolute z-[-1] bottom-25 right-20 transform rotate-[10deg]">
        <Image src={importImage} alt="import" width={400} height={200} />
      </div>
    </div>
  );
}
