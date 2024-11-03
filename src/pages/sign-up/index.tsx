import React, { ReactElement } from "react";

import type { NextPageWithLayout } from "../_app";
import AuthLayout from "@/components/layout/auth-layout";
import SignUpPage from "@/modules/auth/sign-up/sign-up-page";

const SignUp: NextPageWithLayout = () => {
  return <SignUpPage />;
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignUp;
