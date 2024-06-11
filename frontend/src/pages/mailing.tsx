import ContactList from "@/components/mailing/ContactList";
import MailArea from "@/components/mailing/MailArea";
export default function MailingPage() {
  return (
    <>
      <h1 className="text-xl text-red-950">
        Bienvenue sur la page d'envoie d'e-mail
      </h1>
      <section className="flex justify-between w-full  mt-10 bg-pink-100 p-5">
        <ContactList />
        <MailArea />
      </section>
    </>
  );
}
