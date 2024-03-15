import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import RedButton from "./buttons/Redbutton";
import { AuthContext } from "@/contexts/authContext";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import builderImage from "@/assets/homepage/builder.jpg";


const SIGN_IN = gql`
  mutation SignIn($password: String!, $email: String!) {
    signIn(password: $password, email: $email)
  }
`;

export default function SignIn() {
  const { setAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  })

  const [signIn] = useMutation(SIGN_IN, {
    variables: {
      email,
      password
    },
    onCompleted(data: any) {
      localStorage.setItem("token", data.signIn);
      setAuthenticated(true);
      router.push('/');
    }
  })

  return (
      <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
          <div className="pt-6 w-full flex flex-col flex-wrap items-center">
              <h2 className="text-2xl mb-10">Connectez-vous</h2>

              <div className="form-control w-full mb-6 flex justify-center">
                  <input
                      type="email"
                      onChange={(e) => {
                        setEmail(e.target.value)
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
                    setPassword(e.target.value)
                  }}
                  placeholder="Mot de passe"
                  required
                  className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
              />
              </div>
              <div className="mb-6">
                    <RedButton
                        text="Connexion"
                        padding={"p-3"}
                        isBold={false}
                        size={"lg"}
                        onClick={() => {signIn()}}
                    />
                </div>
            </div>
            <div className="flex items-center">
                <a href="/signUp">Pas de compte ? Inscrivez-vous.</a>
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