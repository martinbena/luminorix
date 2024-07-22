"use client";

import * as actions from "@/actions";
import { useEffect, useRef } from "react";
import Form from "../ui/Form";
import { useFormState } from "react-dom";
import Link from "next/link";
import paths from "@/lib/paths";
import { useForgottenPasswordContext } from "@/app/contexts/ForgottenPasswordContext";

export default function EmailConfirmForm() {
  const { currentStep, setCurrentStep, setEmail } =
    useForgottenPasswordContext();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [formState, action] = useFormState(actions.generateResetCode, {
    errors: {},
    success: false,
    email: "",
  });

  useEffect(() => {
    if (currentStep === 1 && formState.success) {
      if (formState.email?.length) {
        setEmail(formState.email);
      }
      setCurrentStep(2);
    }
  }, [formState, setCurrentStep, setEmail, currentStep]);

  return (
    <Form formAction={action}>
      <Form.Title textAlign="left">Forgotten password</Form.Title>
      <Form.InputGroup
        name="email"
        inputType="email"
        error={formState.errors.email}
        inputRef={emailInputRef}
      >
        E-mail
      </Form.InputGroup>
      <Form.InputGroup
        name="email-confirm"
        inputType="email"
        error={formState.errors.emailConfirm}
      >
        E-mail confirm
      </Form.InputGroup>
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
