"use client";
import FormForgetPassword from "@/components/FormForgetPassword";
import FormForgetPasswordConsolidate from "@/components/FormForgetPasswordConsolidate";
import FormForgetPasswordValidate from "@/components/FormForgetPasswordValidate";
import { useState } from "react";

export default function ForgetPassword() {
  const [email, setEmail] = useState<string>("");
  const [isValidated, setIsValidated] = useState<boolean>(false);

  return (
    <div>
      {email === "" ? (
        <FormForgetPassword setEmail={setEmail} />
      ) : email !== "" && !isValidated ? (
        <FormForgetPasswordValidate
          email={email}
          setIsValidate={setIsValidated}
        />
      ) : email !== "" && isValidated ? (
        <FormForgetPasswordConsolidate email={email} />
      ) : (
        ""
      )}
    </div>
  );
}
