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
import { getSession, signIn } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { Toaster } from "./ui/toaster";
import { useToast } from "./ui/use-toast";

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(4, { message: "Password incorrect" }),
    confirmPassword: z.string().min(4, { message: "Password incorrect" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface FormRegisterProps {
  setIsLogin: (isLogin: boolean) => void;
}

interface UserData {
  email: string;
  name: string;
  password: string;
}

export default function FormRegister({ setIsLogin }: FormRegisterProps) {
  const [error, setError] = useState<string>("");
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);

    const userData: UserData = {
      email: values.email,
      name: values.username,
      password: values.password,
    };

    register(userData);
  }

  const { toast } = useToast();

  async function register(values: UserData) {
    try {
      const signUpResponse = await axios.post("/api/auth/signup", values);
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
      const user: any = await getSession();
      if (res?.ok && user?.user?.confirmed!) {
        toast({ title: "Approved", description: "You have access" });
        return router.push("/profile");
      } else {
        return router.push("/validate-account");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster />
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Register</h1>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96 mb-4 text-slate-500">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Joe Mef" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input placeholder="****" {...field}/>
                  </FormControl>
                  {/* <FormDescription>Define one password</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                  checked={acceptedTerms}
                  onChange={() => {
                    setAcceptedTerms(!acceptedTerms);
                  }}
                />
                <label htmlFor="terms" className="text-gray-700">
                  Accept terms and conditions
                </label>
              </div>
              <Link
                href="/terms-conditions"
                className="hover:underline text-slate-500"
              >
                Read Terms and conditions
              </Link>

              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="hover:underline text-blue-500 font-bold"
              >
                You already have an account?
              </button>
            </div>

            <Button type="submit" disabled={!acceptedTerms}>
              Register
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
