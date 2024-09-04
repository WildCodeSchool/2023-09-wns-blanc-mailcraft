import NavBar from "@/components/NavBars/HomeNavBar";
import SignUpForm from "@/components/Forms/SignUpForm";

export default function signUpPage() {
  return (
    <>
      <section className="w-full">
        <section className="w-full xl:w-[70%] mx-auto ">
          <section className="w-full">
            <NavBar issignUpPage={true} />
          </section>
          <section className="">
            <SignUpForm />
          </section>
        </section>
      </section>
    </>
  );
}
