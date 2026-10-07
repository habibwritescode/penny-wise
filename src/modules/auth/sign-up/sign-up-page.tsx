import Typography from "@/components/typography";
import Link from "next/link";
import DemoAccess from "@/modules/auth/components/demo-access";
import SignUpForm from "./components/signup-form";

const SignUpPage = () => {
  return (
    <>
      <Typography tag="h1">Sign Up</Typography>

      <SignUpForm />

      <DemoAccess />

      <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center">
        <Typography className="text-grey-500" variant="preset-4">
          Already have an account?
        </Typography>

        <Link href="/login">
          <Typography className="underline" variant="preset-4-bold">
            Login
          </Typography>
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
