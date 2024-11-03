import Typography from "@/components/typography";
import Link from "next/link";

import LoginForm from "./components/login-form";

const LoginPage = () => {
  return (
    <div className="bg-white p-8 space-y-8 rounded-xl max-w-[560px]">
      <Typography tag="h1">Login</Typography>

      <LoginForm />

      <div className="flex gap-2 justify-center">
        <Typography className="text-grey-500" variant="preset-4">
          Need to create an account?
        </Typography>

        <Link href="/sign-up">
          <Typography className="underline" variant="preset-4-bold">
            Sign Up
          </Typography>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
