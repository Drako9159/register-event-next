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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(4, { message: "Password incorrect" }),
});

interface FormLoginProps {
  isLogin?: boolean;
}

export default function FormLogin({ isLogin }: FormLoginProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">
          {isLogin ? "Login" : "Register"}
        </h1>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96 mb-4 text-slate-500">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {isLogin || (
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
            )}

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

            {isLogin || (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <input type="checkbox" id="terms" className="mr-2" />
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
              </div>
            )}

            {isLogin && (
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
            )}

            <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
