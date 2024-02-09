import Image from "next/image";
import Redbutton from "@/components/buttons/Redbutton";
import HomeCard from "@/components/Cards/HomeCard";
import NavBar from "@/components/NavBar";
import preview from "@/assets/home_preview.png";
import mediaLibrary from "../../public/images/import.jpg";
import builder from "../../public/images/builder.jpg";
import emailSender from "../../public/images/send.jpg";

export default function Home() {
  return (
    <section className="xl:custom-bg w-full">
      <section className="w-[80%] xl:w-[70%] mx-auto ">
        <section className="flex xl:justify-between flex-col xl:flex-row">
          <div className="xl:text-white mx-auto text-[#000]">
            <h1 className="xl:text-4xl text-3xl xl:w-[60%]">
              Libérez votre créativité avec{" "}
              <span className="text-[#E83B4E]">MailCraft</span>
            </h1>
            <div className="xl:hidden my-7">
              <Image src={preview} alt="app preview" width={600} height={200} />
            </div>
            <p className="xl:w-[31%] leading-[30px] my-7">
              Tout ce dont vous avez besoin pour vos modèles d'e-mails
              personnalisés en une seule plateforme, prêt à l'envoi en quelques
              minutes. Glissez, déposez , envoyez !
            </p>
            <div className="mx-auto xl:mx-0 w-1/2">
              <Redbutton
                text="Je m'inscris !"
                padding={"p-3"}
                isBold={false}
                size={"lg"}
                link={"/"}
              />
            </div>
          </div>
          <div className="hidden xl:block">
            <Image src={preview} alt="app preview" width={600} height={200} />
          </div>
        </section>
        <div className="flex flex-col xl:flex-row justify-between mt-10">
          <h2 className="xl:hidden text-center text-2xl  text-[#000]">
            Découvrez nos services :
          </h2>
          <HomeCard
            title="Importez vos fichiers"
            picture={mediaLibrary}
            description="Importez et stockez vos fichiers dans votre médiathèque pour les réutiliser facilement dans vos templates."
          />

          <HomeCard
            title="Personnalisez vos templates"
            picture={builder}
            description="Notre interface drag & drop intuitive vous aide à créer des modèles personnalisés et attrayants en toute simplicité."
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
