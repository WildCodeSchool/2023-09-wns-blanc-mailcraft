import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomeCard from "../components/Cards/HomeCard";
import mediaLibrary from "../../public/images/import.jpg";
import builder from "../../public/images/builder.jpg";
import emailSender from "../../public/images/send.jpg";

describe("HomeCard", () => {
  it("renders the first home card component", () => {
    const title = "Importez vos fichiers";
    const picture = mediaLibrary;
    const description = "Importez et stockez vos fichiers dans votre médiathèque pour les réutiliser facilement dans vos templates.";

    render(<HomeCard title={title} picture={picture} description={description} />);

    const cardTitle = screen.getByRole("heading", { level: 1 });
    const cardPicture = screen.getByRole("img");
    const cardDescription = screen.getByText(description);

    expect(cardTitle).toBeInTheDocument();
    expect(cardPicture).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  it("renders the second home card component", () => {
    const title = "Personnalisez vos templates";
    const picture = builder;
    const description = "Notre interface drag & drop intuitive vous aide à créer des modèles personnalisés et attrayants en toute simplicité.";

    render(<HomeCard title={title} picture={picture} description={description} />);

    const cardTitle = screen.getByRole("heading", { level: 1 });
    const cardPicture = screen.getByRole("img");
    const cardDescription = screen.getByText(description);

    expect(cardTitle).toBeInTheDocument();
    expect(cardPicture).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  it("renders the third home card component", () => {
    const title = "Envoyez vos mails";
    const picture = emailSender;
    const description = "Une fois votre template créé, testez le résultat en envoyant vos mails aux contacts de votre choix !";

    render(<HomeCard title={title} picture={picture} description={description} />);

    const cardTitle = screen.getByRole("heading", { level: 1 });
    const cardPicture = screen.getByRole("img");
    const cardDescription = screen.getByText(description);

    expect(cardTitle).toBeInTheDocument();
    expect(cardPicture).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });
});