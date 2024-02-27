"use client";

import FormLogin from "@/components/FormLogin";
import FormRegister from "@/components/FormRegister";
import { useState } from "react";

export default function Authenticate() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  // return <FormLogin isLogin={isLogin}></FormLogin>;
  return <div>{isLogin ? <FormLogin /> : <FormRegister />}</div>;
}
