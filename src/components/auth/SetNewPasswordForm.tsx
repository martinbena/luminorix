"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import paths from "@/lib/paths";
import Link from "next/link";
import { useForgottenPasswordContext } from "@/app/contexts/ForgottenPasswordContext";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SetNewPasswordForm() {
  const { email, resetCode, currentStep } = useForgottenPasswordContext();
  const router = useRouter();
  const [formState, action] = useFormState(
    actions.createNewPassword.bind(null, email, resetCode.join("")),
    {
      errors: {},
      success: false,
    }
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (currentStep === 3 && formState.success) {
      toast.success("Password successfully changed");
      formRef.current?.reset();
      router.push(paths.login());
    }
  }, [formState, router, currentStep]);

  return (
    <Form formRef={formRef} formAction={action}>
      <Form.Title textAlign="left">Forgotten password</Form.Title>
      <Form.InputGroup
        name="password"
        inputType="password"
        error={formState.errors.password}
      >
        New password
      </Form.InputGroup>
      <Form.InputGroup
        name="password-confirm"
        inputType="password"
        error={formState.errors.passwordConfirm}
      >
        Confirm new password
      </Form.InputGroup>{" "}
      {formState.errors._form ? (
        <Form.Error>{formState.errors._form?.join(" | ")}</Form.Error>
      ) : null}
      <Form.Button>Set password</Form.Button>
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
