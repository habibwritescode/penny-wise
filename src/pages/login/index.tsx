import React, { ReactElement } from "react";

import type { NextPageWithLayout } from "../_app";
import AuthLayout from "@/components/layout/auth-layout";
import LoginPage from "@/modules/auth/login/login-page";

const Login: NextPageWithLayout = () => {
  return <LoginPage />;
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
