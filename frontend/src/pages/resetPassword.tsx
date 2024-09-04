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
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [updatePassword] = useMutation(UPDATE_PASSWORD_MUTATION);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (!/.{10,}/.test(password)) {
      errors.push("Minimum 10 caractères");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Minimum 1 majuscule");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Minimum 1 minuscule");
    }
    if (!/\d/.test(password)) {
      errors.push("Minimum 1 chiffre");
    }
    return errors;
  };

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewPassword(value);
    setPasswordErrors(validatePassword(value));
  };
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const passwordValidationErrors = validatePassword(newPassword);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await updatePassword({
        variables: { token, newPassword },
      });
      setMessage("Votre mot de passe a bien été mis à jour. Vous pouvez maintenant vous connecter.");
    } catch (error) {
      setMessage("Une erreur s'est produite lors de la réinitialisation du mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
      <div className="container sm:mt-40 mt-24 my-auto max-w-md border-2 border-gray-200 rounded-[20px] p-3 bg-slate-50 shadow-sm">
        <h2 className="text-2xl mb-10 text-center font-bold">Votre nouveau mot de passe</h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="form-control w-full mb-6 flex justify-center relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de Passe"
              value={newPassword}
              onChange={handleNewPasswordChange}
              onFocus={() => setShowPasswordPopup(true)}
              onBlur={() => setShowPasswordPopup(false)}
              required
              className="shadow-md input input-bordered w-5/6 sm:w-3/4 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            />
            {showPasswordPopup && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[20rem] bg-white shadow-md p-4 z-50">
                <ul>
                  <li>{passwordErrors.includes("Minimum 10 caractères") ? "✗" : "✔"} Minimum 10 caractères</li>
                  <li>{passwordErrors.includes("Minimum 1 majuscule") ? "✗" : "✔"} Minimum 1 majuscule</li>
                  <li>{passwordErrors.includes("Minimum 1 minuscule") ? "✗" : "✔"} Minimum 1 minuscule</li>
                  <li>{passwordErrors.includes("Minimum 1 chiffre") ? "✗" : "✔"} Minimum 1 chiffre</li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-control w-full mb-6 flex justify-center relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmer nouveau mot de passe"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="shadow-md input input-bordered w-5/6 sm:w-3/4 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6 pr-10"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="Edit / Show">
                    <g id="Vector">
                      <path d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" stroke="#000000" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  </g>
                </svg>
              ) : (
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="Edit / Hide">
                    <path id="Vector" d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.4356C12.937 13.7903 12.4715 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.5194 10.2101 11.0538 10.5649 10.668" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              )}
            </button>
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="shadow-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
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
      <div className="hidden xl:block absolute z-[-1] bottom-44 left-20 transform rotate-[-20deg]">
        <Image src={emailSender} alt="import" width={280} height={200} />
      </div>
      <div className="hidden xl:block absolute z-[-1] bottom-44 right-20 transform rotate-[10deg]">
        <Image src={builderImage} alt="import" width={280} height={200} />
      </div>
    </div>
  );
}
