"use client";
import FormForgetPassword from "@/components/FormForgetPassword";
import FormForgetPasswordValidate from "@/components/FormForgetPasswordValidate";
import { useState } from "react";

export default function ForgetPassword() {
  const [email, setEmail] = useState<string>("");

  return (
    <div>
      {email === "" ? (
        <FormForgetPassword setEmail={setEmail} />
      ) : (
        <FormForgetPasswordValidate email={email} />
      )}
    </div>
  );
}
