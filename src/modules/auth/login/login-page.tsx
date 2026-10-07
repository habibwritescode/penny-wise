import Typography from "@/components/typography";
import Link from "next/link";
import DemoAccess from "@/modules/auth/components/demo-access";

import LoginForm from "./components/login-form";

const LoginPage = () => {
  return (
    <>
      <Typography tag="h1">Login</Typography>

      <LoginForm />

      <DemoAccess />

      <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center">
        <Typography className="text-grey-500" variant="preset-4">
          Need to create an account?
        </Typography>

        <Link href="/sign-up">
          <Typography className="underline" variant="preset-4-bold">
            Sign Up
          </Typography>
        </Link>
      </div>
    </>
  );
};

export default LoginPage;
