import Image from "next/image";
import Redbutton from "@/components/Buttons/Redbutton";
import HomeCard from "@/components/Cards/HomeCard";
import preview from "@/assets/homepage/home_preview.png";
import mediaLibrary from "@/assets/homepage/import.jpg";
import builder from "@/assets/homepage/builder.jpg";
import emailSender from "@/assets/homepage/send.jpg";
import NavBar from "@/components/NavBars/HomeNavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    console.log(`User is ---> ${JSON.stringify(user)}`);
  }, [user]);
  return (
    <section className="xl:custom-bg w-full">
      <section className="w-full md:w-[90%] xl:w-[70%] mx-auto ">
        <NavBar issignUpPage={false} />
        <section className="flex xl:justify-between flex-col xl:flex-row mx-5 md:mt-5">
          <div className="xl:text-white mx-auto text-[#000]">
            <h1 className="xl:text-4xl text-3xl xl:w-[50%]">
              Libérez votre créativité avec{" "}
              <span className="text-[#E83B4E]">MailCraft</span>
            </h1>
            <div className="xl:hidden my-7">
              <Image src={preview} alt="app preview" width={600} height={200} />
            </div>
            <p className="xl:w-[41%] leading-[30px] my-7 text-lg">
              Tout ce dont vous avez besoin pour vos modèles d'e-mails
              personnalisés en une seule plateforme, prêt à l'envoi en quelques
              minutes. Glissez, déposez, envoyez !
            </p>
            {!isAuthenticated ? (
              <div className="mx-auto xl:mx-0 w-1/2">
                <Redbutton
                  text="S'inscrire"
                  padding={"px-4 py-3"}
                  isBold={false}
                  size={"lg"}
                  type="button"
                  href="/signUp"
                  shadow={"lg"}
                  onClick={() => router.push("/signUp")}
                />
              </div>
            ) : (
              <Link href="/template/creation">
                <p className="underline text-red-500 text-xl">
                  Créer un template
                </p>
              </Link>
            )}
          </div>
          {/* <div className="hidden xl:block">
            <Image src={preview} alt="app preview" width={600} height={200} />
          </div> */}
        </section>
        <div className="flex flex-col items-center xl:flex-row justify-between mt-10">
          <h2 className="xl:hidden text-center text-2xl text-[#000]">
            Découvrez nos services :
          </h2>
          <HomeCard
            title="Télécharger vos templates"
            picture={mediaLibrary}
            description="Télécharger vos templates personnalisés en format HTML et utilisez les facilement via votre mesagerie"
          />
          <HomeCard
            title="Personnalisez vos templates"
            picture={builder}
            description="Notre interface drag & drop intuitive vous aide à créer des modèles personnalisés en toute simplicité."
          />
          <HomeCard
            title="Envoyez vos mails"
            picture={emailSender}
            description="Une fois votre template créé, testez le résultat en envoyant vos mails aux contacts de votre choix !"
          />
        </div>
      </section>
    </section>
  );
}
