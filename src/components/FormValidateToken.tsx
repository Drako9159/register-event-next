import { Toaster } from "@/components/ui/toaster";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  code: z
    .string()
    .min(5, { message: "Code incorrect" })
    .max(5, { message: "Code incorrect" }),
});
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { getSession } from "next-auth/react";
import SendMailConfirmation from "@/app/hooks/SendMailConfirmation";

interface EmailValidate {
  email: string;
}

export default function FormValidateToken() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    async function session() {
      const user: any = await getSession();
      setEmail(user?.user?.email);
      if (email !== "") {
        SendMailConfirmation(email);
      }
    }
    session();
  }, [email]);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const { toast } = useToast();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    /*
    const userData: UserDataLogin = {
      email: values.email,
      password: values.password,
    };*/
    const code = values.code;
    validateToken(code);
  }

  async function validateToken(token: string) {
    try {
      // const user: any = await getSession();
      // const email = user?.user?.email;

      const res = await axios.post(
        "/api/auth/actions/confirmation/validate-token",
        {
          email,
          token,
        }
      );
      toast({ title: "Validated", description: "User validated" });
      if (res?.status) return router.push("/profile");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast({ title: "Error", description: "Code is invalid" });
        setError(error.response?.data.message);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster />
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Validate your account</h1>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96 mb-4 text-slate-500">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="102312" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insert the 5-digit code sent to the e-mail address you have
                    provided.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Send</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
