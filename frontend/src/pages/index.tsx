import Image from "next/image";
import Redbutton from "@/components/buttons/Redbutton";
import preview from "@/assets/home_preview.png";
export default function Home() {
  return (
    <section className="custom-bg w-full">
      <section className="flex justify-between w-[70%] mx-auto">
        <div className="text-white">
          <h1 className="text-4xl w-[60%]">
            Libérez votre créativité avec{" "}
            <span className="text-[#E83B4E]">MailCraft</span>
          </h1>
          <p className="w-[30%] leading-[30px] my-5">
            Tout ce dont vous avez besoin pour vos modèles d'e-mails
            personnalisés en une seule plateforme, prêt à l'envoi en quelques
            minutes. Glissez, déposez , envoyez !
          </p>

          <Redbutton
            text="Je m'inscris !"
            padding={"p-3"}
            isBold={false}
            size={"lg"}
            link={"/"}
          />
        </div>
        <Image src={preview} alt="app preview" width={300} height={200} />
      </section>
    </section>
  );
}
