import HomeCard from "@/components/Cards/HomeCard";

export default function Home() {
  return (
    <main>
      <div>
        <h1 className="text-xl text-blue-500">HOME PAGE</h1>
      </div>
      <div className="home-cards flex flex-col md:flex-row md:justify-evenly">
        <>
          <HomeCard
            title="Personnalisez vos templates"
            picture="images/builder.jpg"
            description="Notre interface drag & drop intuitive vous aide à créer des modèles personnalisés et attrayants en toute simplicité." />

          <HomeCard
            title="Importez vos fichiers"
            picture="images/import.jpg"
            description="Importez et stockez vos fichiers dans votre médiathèque pour les réutiliser facilement dans vos templates." />

          <HomeCard
            title="Envoyez vos mails"
            picture="images/send.jpg"
            description="Une fois votre template créé, testez le résultat en envoyant vos mails aux contacts de votre choix !" />
        </>
      </div>
    </main>
  );
}
