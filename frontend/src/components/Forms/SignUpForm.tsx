import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import builderImage from "@/assets/homepage/builder.jpg";

export default function SignupForm() {
  type SignUpFormState = {
    pseudo: string;
    email: string;
    password: string;
    verifyPassword: string;
  };

  const [sign_upForm, setSign_upForm] = useState<SignUpFormState>({
    pseudo: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<SignUpFormState>>({});

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    console.log(sign_upForm);
  }, [sign_upForm]);

  const router = useRouter();
  const SIGNUP = gql`
    mutation Mutation($userData: UserInput!) {
      signUp(userData: $userData)
    }
  `;
  const DOES_MAIL_ALREADY_EXISTS = gql`
    mutation DoesMailAlreadyExist($mail: String!) {
      doesMailAlreadyExist(mail: $mail)
    }
  `;
  const [checkEmailExistence] = useMutation(DOES_MAIL_ALREADY_EXISTS);

  const isRealMail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(emailRegex.test(email), "boolean in the function");

    return emailRegex.test(email);
  };

  const isValidMail = async (mail: string): Promise<boolean> => {
    try {
      const { data } = await checkEmailExistence({ variables: { mail } });

      const mailExists = data.doesMailAlreadyExist === "true";
      const realMail = isRealMail(mail);

      const isValid = !mailExists && realMail;

      return isValid;
    } catch (error) {
      console.error("Error during mail validation:", error);
      throw new Error("Error while validating the mail");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSign_upForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [signup] = useMutation(SIGNUP, {
    onCompleted(data) {
      router.push("/signIn");
    },
  });

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

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSign_upForm((prevState) => ({
      ...prevState,
      password: value,
    }));
    setPasswordErrors(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFieldErrors: Partial<SignUpFormState> = {};

    const passwordValidationErrors = validatePassword(sign_upForm.password);
    if (passwordValidationErrors.length > 0) {
      newFieldErrors.password = "Le mot de passe ne respecte pas les critères";
      setPasswordErrors(passwordValidationErrors);
    }

    if (sign_upForm.password !== sign_upForm.verifyPassword) {
      newFieldErrors.verifyPassword = "Les mots de passe ne correspondent pas";
    }

    try {
      const emailIsValid = await isValidMail(sign_upForm.email);
      console.log(`Email is valid: ${emailIsValid}`);
      if (!emailIsValid) {
        newFieldErrors.email =
          "L'adresse e-mail n'est pas valide ou existe déjà";
      }

      if (Object.keys(newFieldErrors).length > 0) {
        setFieldErrors(newFieldErrors);
        return;
      }

      signup({
        variables: {
          userData: {
            pseudo: sign_upForm.pseudo,
            email: sign_upForm.email,
            password: sign_upForm.password,
          },
        },
      });
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="max-w-screen-xl w-full flex flex-col items-center justify-center mx-auto py-8 mb-10">
      <h2 className="font-bold text-2xl mb-10 text-center">Créer un compte gratuitement</h2>
      <form
        className="w-full max-w-lg flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div className="form-control w-full mb-6 flex flex-col sm:flex-row justify-center items-center">
          <label htmlFor="pseudo" className="font-semibold w-5/6 sm:w-2/4 text-left sm:text-right pr-4">
            Nom d'utilisateur :
          </label>
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            required
            className="shadow-md input input-bordered w-5/6 sm:w-3/4 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={handleInputChange}
          />
          {fieldErrors.pseudo && (
            <p className="text-red-500">{fieldErrors.pseudo}</p>
          )}
        </div>
        {fieldErrors.email && (
    <p className="text-red-500  text-right text-xs italic w-5/6 sm:w-3/4 mb-2">{fieldErrors.email}</p>
  )}
  
        <div className="form-control w-full mb-6 flex flex-col sm:flex-row justify-center items-center">
          <label htmlFor="email" className="font-semibold w-5/6 sm:w-2/4 text-left sm:text-right pr-4">
            Adresse mail :
          </label>
          
          <input
            type="email"
            name="email"
            id="email"
            required
            className="shadow-md input input-bordered w-5/6 sm:w-3/4 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={handleInputChange}
          />
        
        </div>
        {fieldErrors.password && (
            <p className="text-red-500  text-right text-sm w-5/6 sm:w-3/4 mb-2">{fieldErrors.password}</p>
          )}
          {fieldErrors.verifyPassword && (
    <p className="text-red-500 text-right text-xs italic w-5/6 sm:w-3/4 mb-2">{fieldErrors.verifyPassword}</p>
  )}
  
        <div className="form-control w-full mb-6 flex flex-col sm:flex-row justify-center items-center relative">
          <label htmlFor="password" className="font-semibold w-5/6 sm:w-2/4 text-left sm:text-right pr-4">
            Mot de passe :
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            required
            className="shadow-md input input-bordered w-5/6 sm:w-3/4 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={handlePasswordChange}
            onFocus={() => setShowPasswordPopup(true)}
            onBlur={() => setShowPasswordPopup(false)}


          />
          {showPasswordPopup && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[20rem] bg-white shadow-md p-4 z-50">
              <ul>
                <li>
                  {passwordErrors.includes("Minimum 10 caractères") ? "✗" : "✔"}{" "}
                  Minimum 10 caractères
                </li>
                <li>
                  {passwordErrors.includes("Minimum 1 majuscule") ? "✗" : "✔"}{" "}
                  Minimum 1 majuscule
                </li>
                <li>
                  {passwordErrors.includes("Minimum 1 minuscule") ? "✗" : "✔"}{" "}
                  Minimum 1 minuscule
                </li>
                <li>
                  {passwordErrors.includes("Minimum 1 chiffre") ? "✗" : "✔"}{" "}
                  Minimum 1 chiffre
                </li>
              </ul>
            </div>
          )}
          
        </div>
  
        <div className="form-control w-full mb-6 flex flex-col sm:flex-row justify-center items-center relative">
  <label htmlFor="verifyPassword" className="font-semibold w-5/6 sm:w-2/4 text-left sm:text-right pr-4">
    Confirmer mot de passe :
  </label>
  <div className="relative w-5/6 sm:w-3/4 xl:w-[77%]">
    <input
      type={showPassword ? "text" : "password"}
      name="verifyPassword"
      id="verifyPassword"
      required
      className="shadow-md input input-bordered w-full rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6 pr-10"
      onChange={handleInputChange}
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
            <path id="Vector" d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      )}
    </button>
  </div>
  
</div>

        <div className="flex flex-col items-center mt-5 mb-6 w-full">
          <button
            type="submit"
            className="shadow-md px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition mb-2"
          >
            Je m'inscris !
          </button>
          <Link href="/signIn" className="text-sm italic hover:underline">Déjà inscrit ? Connectez-vous.</Link>
        </div>
      </form>
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