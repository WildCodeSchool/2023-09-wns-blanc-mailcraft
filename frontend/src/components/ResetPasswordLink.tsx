import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import builderImage from "@/assets/homepage/builder.jpg";
import { gql, useMutation } from "@apollo/client";

export default function ResetPasswordLink({ setShowResetPassword }) {
  const [userMail, setUserMail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const DOES_MAIL_ALREADY_EXISTS = gql`
    mutation DoesMailAlreadyExist($mail: String!) {
      doesMailAlreadyExist(mail: $mail)
    }
  `;
  const [checkEmailExistence] = useMutation(DOES_MAIL_ALREADY_EXISTS);

  const isValidMail = async (mail: string): Promise<boolean> => {
    try {
      // Appel à la mutation GraphQL pour vérifier si l'e-mail existe dans la base de données
      const { data } = await checkEmailExistence({ variables: { mail } });

      // Vérifier si l'e-mail existe
      const mailExists = data.doesMailAlreadyExist === "true";
      // Vérifier si l'e-mail a un format valide
      const realMail = validateEmail(mail);

      // Retourner vrai si l'e-mail existe et est valide, faux sinon
      return mailExists && realMail;

    } catch (error) {
      console.error("Error during mail validation:", error);
      throw new Error("Error while validating the mail");
    }
  };

   const requireResetLink = async (userMail: string) => {
    setLoading(true);
    setMessage("");
    setError("");
    setEmailError("");
    try {
      // Vérifier si l'e-mail est valide avant d'envoyer le lien de réinitialisation
      const isValid = await isValidMail(userMail);

      if (isValid) {
        // Si l'e-mail est valide, envoyer le lien de réinitialisation
        await axios.post(
          "http://localhost:5050/generateResetPasswordLink",
          { recipient: userMail }
        );
        setMessage(
          "Veuillez vérifier votre boîte mail, un lien vient de vous être envoyé."
        );
      } else {
        // Si l'e-mail n'est pas valide, afficher un message d'erreur
        setError("Cette adresse e-mail n'existe pas dans notre base de données ou est invalide.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 404) {
            setMessage("La route n'a pas été trouvée (404). Vérifiez l'URL.");
          } else {
            setMessage(
              `Erreur: ${
                error.response.data.error || "Une erreur s'est produite"
              }`
            );
          }
        } else if (error.request) {
          setMessage(
            "Aucune réponse du serveur. Vérifiez votre connexion réseau."
          );
        } else {
          setMessage(`Erreur: ${error.message}`);
        }
      } else {
        setMessage("Une erreur inconnue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
      <div className="pt-6 w-full flex flex-col flex-wrap items-center">
        <h2 className="text-2xl mb-10 font-bold text-center">
          Recevez un lien pour mettre à jour votre mot de passe
        </h2>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            onChange={(e) => setUserMail(e.target.value)}
            required
            className={`shadow-md input input-bordered w-5/6 sm:w-2/5 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6 "
            }`}
          />
        </div>
        {emailError && <p className="text-red-500 italic">{emailError}</p>}
        <div className="mb-6">
          <button
            onClick={() => requireResetLink(userMail)}
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            Mettre à jour
          </button>
        </div>
        {loading && (
          <div className="spinner border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
        )}
        {error && <div className=" text-center text-red-500 italic ">{error}</div>}
        {message && <div className=" text-center text-green-800">{message}</div>}
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
