import Typography from "@/components/typography";
import Link from "next/link";
import SignUpForm from "./components/signup-form";

const SignUpPage = () => {
  return (
    <div className="bg-white p-8 space-y-8 rounded-xl max-w-[560px]">
      <Typography tag="h1">Sign Up</Typography>

      <SignUpForm />

      <div className="flex gap-2 justify-center">
        <Typography className="text-grey-500" variant="preset-4">
          Already have an account?
        </Typography>

        <Link href="/login">
          <Typography className="underline" variant="preset-4-bold">
            Login
          </Typography>
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
