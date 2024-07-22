"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import VerificationCodeInput from "./VerificationCodeInput";
import paths from "@/lib/paths";
import Link from "next/link";
import { useEffect } from "react";
import { useForgottenPasswordContext } from "@/app/contexts/ForgottenPasswordContext";

export default function PasswordResetCodeForm() {
  const { email, resetCode, setResetCode, currentStep, setCurrentStep } =
    useForgottenPasswordContext();
  const [formState, action] = useFormState(
    actions.enterResetCode.bind(null, email, resetCode.join("")),
    {
      errors: {},
      success: false,
    }
  );

  useEffect(() => {
    if (currentStep === 2 && formState.success) {
      setCurrentStep(3);
    }
  }, [formState, setCurrentStep, currentStep]);

  return (
    <Form formAction={action}>
      <Form.Title textAlign="left">Forgotten password</Form.Title>

      <div className="p-4 bg-green-100 text-green-800">
        Please check your email address and enter the password reset code.
      </div>
      <VerificationCodeInput code={resetCode} onChange={setResetCode} />

      {formState.errors._form ? (
        <Form.Error>{formState.errors._form?.join(" | ")}</Form.Error>
      ) : null}
      <Form.Button>Continue</Form.Button>
      <p>
        <Link className="underline" href={paths.login()}>
          Remember your password? Login here
        </Link>
      </p>
      <p>
        <Link className="underline" href={paths.register()}>
          Don&apos;t have an account yet? Create one here
        </Link>
      </p>
    </Form>
  );
}
