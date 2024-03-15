import NavBar from "@/components/NavBar";
import SignIn from "@/components/SignIn";

export default function signInPage() {
    return (
        <>
            <section className="w-full">
                <section className="w-[80%] xl:w-[70%] mx-auto ">
                    <NavBar issignUpPage={true} />
                    <section className="flex xl:justify-between flex-col xl:flex-row">
                        <SignIn />
                    </section>
                </section>
            </section>
        </>
    );
}