import { useRouter } from "next/router";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import importImage from "@/assets/homepage/import.jpg";

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
    <div className="max-w-screen-xl w-full flex flex-col items-center mx-auto py-8 mb-10">
      <h2 className="text-2xl mb-10 ml-[8%]">Créer un compte gratuitement</h2>
      <form
        className="w-full flex flex-col items-start ml-[25%]"
        onSubmit={handleSubmit}
      >
        <div className="form-control w-full mb-6 flex justify-start items-center">
          <label htmlFor="pseudo" className="w-1/4 text-right pr-4">
            Nom d'utilisateur :
          </label>
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            required
            className="input input-bordered w-2/6 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={handleInputChange}
          />
          {fieldErrors.pseudo && (
            <p className="text-red-500">{fieldErrors.pseudo}</p>
          )}
        </div>

        <div className="form-control w-full mb-6 flex justify-start items-center">
          <label htmlFor="email" className="w-1/4 text-right pr-4">
            Adresse mail :
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="input input-bordered w-2/6 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={handleInputChange}
          />
          {fieldErrors.email && (
            <p className="text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="form-control w-full mb-6 flex justify-start items-center relative">
          <label htmlFor="password" className="w-1/4 text-right pr-4">
            Mot de passe :
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            required
            className="input input-bordered w-2/6 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
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
          {fieldErrors.password && (
            <p className="text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div className="form-control w-full mb-6 flex justify-start items-center relative">
          <label htmlFor="verifyPassword" className="w-1/4 text-right pr-4">
            Confirmer mot de passe :
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="verifyPassword"
            id="verifyPassword"
            required
            className="input input-bordered w-2/6 rounded bg-red-100 placeholder:text-gray-400 placeholder:opacity-90 border-0 pl-6"
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? "👁️" : "🙈"}
            {/* emoji à modifier par une icon */}
          </button>
          {fieldErrors.verifyPassword && (
            <p className="text-red-500">{fieldErrors.verifyPassword}</p>
          )}
        </div>

        <div className="flex flex-col items-center mb-6 mx-auto w-full">
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition mb-2"
          >
            Je m'inscris !
          </button>
          <Link href="/signIn">Déjà inscrit ? Connectez-vous.</Link>
        </div>
      </form>
      <div className="absolute z-[-1] bottom-25 right-20 transform rotate-[10deg]">
        <Image src={importImage} alt="import" width={400} height={200} />
      </div>
    </div>
  );
}
