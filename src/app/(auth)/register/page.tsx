import React from "react";
import AuthWrapper from "@/components/auth/auth-wrapper";
import RegisterForm from "@/components/auth/register-form";

const page = () => {
  return (
    <AuthWrapper>
      <RegisterForm />
    </AuthWrapper>
  );
};

export default page;
