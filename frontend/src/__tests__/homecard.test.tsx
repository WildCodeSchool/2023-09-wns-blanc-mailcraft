import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomeCard from "../components/Cards/HomeCard";

describe("HomeCard", () => {
  it("renders the first home card component", () => {
    render(<HomeCard title="Personnalisez vos templates" picture="images/builder.jpg" description="Notre interface drag & drop intuitive vous aide à créer des modèles personnalisés et attrayants en toute simplicité." />);

    const cardTitle = screen.getByRole("heading", { level: 1 });
    const cardPicture = screen.getByRole("img");
    const cardDescription = screen.getByRole("p");

    expect(cardTitle).toBeInTheDocument();
    expect(cardPicture).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  it("renders the second home card component", () => {
    render(<HomeCard title="Importez vos fichiers" picture="images/import.jpg" description="Importez et stockez vos fichiers dans votre médiathèque pour les réutiliser facilement dans vos templates." />);

    const cardTitle = screen.getByRole("heading", { level: 1 });
    const cardPicture = screen.getByRole("img");
    const cardDescription = screen.getByRole("p");

    expect(cardTitle).toBeInTheDocument();
    expect(cardPicture).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  it("renders the third home card component", () => {
    render(<HomeCard title="Envoyez vos mails" picture="images/send.jpg" description="Une fois votre template créé, testez le résultat en envoyant vos mails aux contacts de votre choix !" />);

    const cardTitle = screen.getByRole("heading", { level: 1 });
    const cardPicture = screen.getByRole("img");
    const cardDescription = screen.getByRole("p");

    expect(cardTitle).toBeInTheDocument();
    expect(cardPicture).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });
});