  import { useRouter } from "next/router";
  import { FormEvent, useState } from "react";
import RedButton from "./buttons/Redbutton";
import Image from "next/image";
import emailSender from "@/assets/homepage/send.jpg";
import importImage from "@/assets/homepage/import.jpg";

  
  export default function Signup() {
  
    return (
        <div className="max-w-screen-xl w-full flex flex-col flex-wrap items-center mx-auto py-8 mb-10">
            <form className="pt-6 w-full flex flex-col flex-wrap items-center">
                <h2 className="text-2xl mb-10">Créer un compte gratuitement</h2>
        
                <div className="form-control w-full mb-6 flex justify-center">
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Prénom"
                    required
                    className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
                />
                </div>

                <div className="form-control w-full mb-6 flex justify-center">
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Nom"
                    required
                    className="input input-bordered w-2/6 rounded-3xl bg-red-100 placeholder:text-black border-0 pl-6"
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
                        onClick={() => {}}
                    />
                </div>
            </form>
            <div className="flex items-center">
                <a href="/signIn">Déjà inscrit ? Connectez-vous.</a>
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