import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
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
