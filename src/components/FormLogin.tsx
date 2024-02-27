import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

const formSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(4, { message: "Password incorrect" }),
});

interface FormLoginProps {
  isLogin?: boolean;
}

interface UserDataLogin {
  email: string;
  password: string;
}

export default function FormLogin() {
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const userData: UserDataLogin = {
      email: values.email,
      password: values.password,
    };

    login(userData);
  }

  const { toast } = useToast();
  async function login(values: UserDataLogin) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      console.log(res.error);
      toast({ title: "Error", description: res.error as string });
      return setError(res.error as string);
    }
    if (res?.ok) {

      toast({ title: "Approved", description: "You have access" });
      return router.push("/profile");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster />
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Login</h1>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96 mb-4 text-slate-500">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="****" {...field} />
                  </FormControl>
                  {/* <FormDescription>Define one password</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center">
              <div className="mb-4">
                <a
                  href="/olvido-contrasena"
                  className="hover:underline text-slate-700"
                >
                  ¿Forget password?
                </a>
              </div>
            </div>

            <Button type="submit">Login</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
