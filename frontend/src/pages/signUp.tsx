import NavBar from "@/components/NavBar";
import SignUp from "@/components/SignUp";

export default function signUpPage() {
    return (
        <>
            <section className="w-full">
                <section className="w-full xl:w-[70%] mx-auto ">
                    <section className="w-full">
                    <NavBar issignUpPage={true} />
                    </section>
                    <section className="flex xl:justify-between flex-col xl:flex-row">
                        <SignUp />
                    </section>
                </section>
            </section>
        </>
    );
}