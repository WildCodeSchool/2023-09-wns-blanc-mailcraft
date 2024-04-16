import NavBar from "@/components/NavBar";
import SignInForm from "@/components/SignInForm";

export default function signInPage() {
  return (
    <>
      <section className="w-full">
        <section className="w-[80%] xl:w-[70%] mx-auto ">
          <NavBar issignUpPage={true} />
          <section className="flex xl:justify-between flex-col xl:flex-row">
            <SignInForm />
          </section>
        </section>
      </section>
    </>
  );
}
