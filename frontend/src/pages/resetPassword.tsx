import { useRouter } from "next/router";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import builderImage from "@/assets/homepage/builder.jpg";

const UPDATE_PASSWORD_MUTATION = gql`
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token)
  }
`;

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; // Récupère le token et l'email de l'URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [updatePassword] = useMutation(UPDATE_PASSWORD_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await updatePassword({
        variables: { token, newPassword },
      });
      setMessage(
        "Votre mot de passe a bien été mis à jour. Vous pouvez maintenant vous connecter."
      );
    } catch (error) {
      setMessage(
        "Une erreur s'est produite lors de la réinitialisation du mot de passe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
      <div className="pt-6 w-full flex flex-col flex-wrap items-center">
        <h2 className="text-2xl mb-10">Votre nouveau mot de passe</h2>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="form-control w-full mb-6 flex justify-center">
            <input
              type="password"
              placeholder="Nouveau mot de Passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
            />
          </div>

          <div className="form-control w-full mb-6 flex justify-center">
            <input
              type="password"
              placeholder="Confirmer nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
            >
              Mettre à jour
            </button>
          </div>
        </form>
        {loading && (
          <div className="spinner border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
        )}
        {message && (
          <div className="mt-4 text-center">
            {message}
            {message.includes("connecter") && (
              <div>
                <a href="/signIn" className="text-blue-500 underline">
                  Connectez-vous
                </a>
              </div>
            )}
          </div>
        )}
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
