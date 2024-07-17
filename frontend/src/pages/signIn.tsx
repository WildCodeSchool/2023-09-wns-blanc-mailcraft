import NavBar from "@/components/NavBars/HomeNavBar";
import SignInForm from "@/components/Forms/SignInForm";
import ResetPasswordLink from "@/components/ResetPasswordLink";
import { useState } from "react";

export default function signInPage() {
  const [showResetPassword, setShowResetPassword] = useState(false);
  return (
    <>
      <section className="w-full">
        <section className="w-[80%] xl:w-[70%] mx-auto ">
          <NavBar issignUpPage={true} />
          <section className="flex xl:justify-between flex-col xl:flex-row">
            {showResetPassword ? (
              <ResetPasswordLink setShowResetPassword={setShowResetPassword} />
            ) : (
              <SignInForm setShowResetPassword={setShowResetPassword} />
            )}
          </section>
        </section>
      </section>
    </>
  );
}
