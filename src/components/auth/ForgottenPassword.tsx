"use client";

import { useForgottenPasswordContext } from "@/app/contexts/ForgottenPasswordContext";
import EmailConfirmForm from "./EmailConfirmForm";
import PasswordResetCodeForm from "./PasswordResetCodeForm";
import SetNewPasswordForm from "./SetNewPasswordForm";

export default function ForgottenPassword() {
  const { currentStep } = useForgottenPasswordContext();

  return (
    <>
      {currentStep === 1 && <EmailConfirmForm />}
      {currentStep === 2 && <PasswordResetCodeForm />}
      {currentStep === 3 && <SetNewPasswordForm />}
    </>
  );
}
