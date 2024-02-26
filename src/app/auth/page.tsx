"use client";

import FormLogin from "@/components/FormLogin";
import { useState } from "react";

export default function Authenticate() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  return <FormLogin isLogin={isLogin}></FormLogin>;
}
