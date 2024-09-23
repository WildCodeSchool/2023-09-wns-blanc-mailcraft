import { useEffect } from "react";
import { useRouter } from "next/router";
import RedButton from "@/components/Buttons/Redbutton";
import NavBar from "@/components/NavBars/UserPagesNavBar";
import React from 'react';

export default function RedirectionPage() {
  const router = useRouter();

  //Si l'utilisateur se connecte sur cette page en desktop, il est immédiatement redirigé vers l'accueil
  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth > 768) {
        router.push("/");
      }
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, [router]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-between p-8">
        <div className="flex flex-col gap-6">
          <h2 className="font-bold text-2xl mt-3 mb-8 text-center">Attention !</h2>
          <p>L'interface de création de templates n'est pas accessible sur mobile.</p>
          <p>Veuillez vous connecter sur un ordinateur pour continuer votre expérience MailCraft.</p>
        </div>
        <div className="mt-80">
          <RedButton
            text="Retour à l'accueil"
            href="/"
            padding={"p-3"}
            shadow="lg"
            isBold={false}
            size={"lg"}
          />
        </div>
      </div>
    </>
  );
}
