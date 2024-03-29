import { Toaster } from "@/components/ui/toaster";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
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
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import SendMailResetPassword from "@/app/hooks/SendMailResetPassword";

interface UserDataLogin {
  email: string;
}
interface FormForgetPasswordParams {
  setEmail: (email: string) => void;
}

export default function FormForgetPassword({
  setEmail,
}: FormForgetPasswordParams) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const userData: UserDataLogin = {
      email: values.email,
    };
    SendMailResetPassword(values.email);
    toast({
      title: "Submitted",
      description: "A code has been sent to your e-mail address.",
    });
    setEmail(values.email);
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="@mail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    You will receive a code to validate your email address.
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
