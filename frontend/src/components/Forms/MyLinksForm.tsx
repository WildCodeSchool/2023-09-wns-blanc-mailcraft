import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileForm } from "@/types/interfaces/profile/profileForm";
import {
  CREATE_USER_LINKS,
  UPDATE_USER_LINKS,
} from "@/client/mutations/user/user-mutations";

export default function MyLinksForm({
  setErrorMessage,
  setSuccessMessage,
}: ProfileForm) {
  const { user, loading, error, setRefreshUser } = useAuth();
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [createUserLinks] = useMutation(CREATE_USER_LINKS);
  const [updateUserLinks] = useMutation(UPDATE_USER_LINKS);

  useEffect(() => {
    if (user && user.socialLinks && user.socialLinks.length > 0) {
      const socialLinks = user.socialLinks[0];
      setFacebookLink(socialLinks.facebook || "");
      setTwitterLink(socialLinks.twitter || "");
      setLinkedinLink(socialLinks.linkedin || "");
    }
  }, [user]);

  const validateLinks = (facebookLink: string, twitterLink: string, linkedinLink: string) => {
    const facebookRegex =
      /^(https?:\/\/)?(www\.)?facebook.com\/([A-Za-z0-9._%-]+)?\/?.*$/;
    const twitterRegex =
      /^(https?:\/\/)?(www\.)?x.com\/([A-Za-z0-9._%-]+)?\/?.*$/;
    const linkedinRegex =
      /^(https?:\/\/)?(www\.)?linkedin.com\/(in|pub|company|school)\/([A-Za-z0-9._%-]+)?\/?.*$/;

    let errors = [];

    if (facebookLink && !facebookRegex.test(facebookLink)) {
      errors.push("Veuillez entrer un lien Facebook valide.");
    }

    if (twitterLink && !twitterRegex.test(twitterLink)) {
      errors.push("Veuillez entrer un lien Twitter valide.");
    }

    if (linkedinLink && !linkedinRegex.test(linkedinLink)) {
      errors.push("Veuillez entrer un lien LinkedIn valide.");
    }

    if (errors.length >= 2) {
      return ["Veuillez entrer des liens valides."];
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const errors = validateLinks(facebookLink, twitterLink, linkedinLink);

    if (errors.length > 0) {
      setErrorMessage(errors[0]);
      return;
    }

    try {
      let mutationResult;

      const socialLinkData = {
        facebook: facebookLink,
        twitter: twitterLink,
        linkedin: linkedinLink,
      };

      if (user.socialLinks && user.socialLinks.length > 0) {
        // Si les liens sociaux existent, utilise la mutation de mise à jour
        mutationResult = await updateUserLinks({
          variables: {
            email: user.email,
            id: user.socialLinks[0].id,
            facebook: facebookLink,
            twitter: twitterLink,
            linkedin: linkedinLink,
          },
        });
      } else {
        // Si les liens sociaux n'existent pas, utilise la mutation de création
        mutationResult = await createUserLinks({
          variables: {
            socialLinkData: socialLinkData,
            email: user.email,
          },
        });
      }

      if (mutationResult.data) {
        setSuccessMessage("Les liens ont été mis à jour avec succès.");
        setRefreshUser(true);
      } else {
        setErrorMessage(
          "Échec de la mise à jour des liens. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des liens : ", error);
      setErrorMessage(
        "Erreur lors de la mise à jour des liens. Veuillez réessayer."
      );
    }
  };

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-full md:max-w-3xl">
      <div className="flex flex-col md:flex-row items-center">
        <label
          htmlFor="facebookLink"
          className="w-full md:w-1/5 text-sm font-medium text-gray-700"
        >
          Facebook :
        </label>
        <input
          type="text"
          id="facebookLink"
          placeholder={facebookLink}
          value={facebookLink}
          onChange={(e) => setFacebookLink(e.target.value)}
          className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <label
          htmlFor="twitterLink"
          className="w-full md:w-1/5 text-sm font-medium text-gray-700"
        >
          Twitter :
        </label>
        <input
          type="text"
          id="twitterLink"
          value={twitterLink}
          placeholder={twitterLink}
          onChange={(e) => setTwitterLink(e.target.value)}
          className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <label
          htmlFor="linkedinLink"
          className="w-full md:w-1/5 text-sm font-medium text-gray-700"
        >
          LinkedIn :
        </label>
        <input
          type="text"
          id="linkedinLink"
          value={linkedinLink}
          placeholder={linkedinLink}
          onChange={(e) => setLinkedinLink(e.target.value)}
          className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="shadow-xl inline-flexitems-center px-4 py-2 md:mr-11 mt-8 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#E83B4E] hover:bg-red-600 hover:shadow-red-500/50 focus:ring-4 focus:outline-none"
        >
          Mettre à jour
        </button>
      </div>
    </form>
  );
}
