import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useBoundStore from "@/lib/store/store";
import nameFromEmail from "@/utils/nameFromEmail";

const formSchema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

const LoginForm = () => {
  const signIn = useBoundStore((store) => store.signIn);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Demo auth: any valid email/password signs in; the password is not kept.
  // AuthLayout redirects home once a user is set.
  const onSubmit = ({ email }: z.infer<typeof formSchema>) => {
    signIn({ name: nameFromEmail(email), email });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormInput
            name="email"
            placeholder="Email"
            label="Email"
            control={form.control}
          />
          <FormInput
            inputType="password"
            name="password"
            placeholder="Password"
            label="Password"
            control={form.control}
          />
        </div>

        <Button className="w-full mt-8" size="xl" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
