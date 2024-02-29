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
    password: z.string().min(4, { message: "Password incorrect" }),
    confirmPassword: z.string().min(4, { message: "Password incorrect" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function FormForgetPasswordConsolidate({ email }: any) {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    updatePassword(values.password);
  }

  const { toast } = useToast();

  async function updatePassword(password: string) {
    try {
      await axios.post(
        "/api/auth/actions/reset-password-token/set-new-password",
        { email, password }
      );
      toast({
        title: "Updated",
        description: "Your password has been updated",
      });
      return router.push("/auth");
      //login(values);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast({ title: "Error", description: error?.response?.data?.message });
        setError(error.response?.data.message);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster />
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96 mb-4 text-slate-500">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                    <Input placeholder="****" {...field} />
                  </FormControl>
                  {/* <FormDescription>Define one password</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button type="submit">
              Reset
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
