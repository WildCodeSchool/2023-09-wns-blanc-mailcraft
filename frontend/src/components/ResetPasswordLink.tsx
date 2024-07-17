import { useState } from "react";
import axios from "axios";
import RedButton from "./Buttons/Redbutton";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import builderImage from "@/assets/homepage/builder.jpg";

export default function ResetPasswordLink({ setShowResetPassword }) {
  const [userMail, setUserMail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const requireResetLink = async (userMail: string) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5050/generateResetPasswordLink",
        { recipient: userMail }
      );
      setMessage(
        "Veuillez vérifier votre boîte mail, un lien vient de vous être envoyé."
      );
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
        <h2 className="text-2xl mb-10">
          Recevez un lien pour mettre à jour votre mot de passe
        </h2>

        <div className="form-control w-full mb-6 flex justify-center">
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            onChange={(e) => setUserMail(e.target.value)}
            required
            className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
          />
        </div>
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
        {message && <div className="mt-4 text-center">{message}</div>}
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
