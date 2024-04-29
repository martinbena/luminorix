"use client";

import * as actions from "@/actions";
import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import AuthFormInputGroup from "./AuthFormInputGroup";
import AuthForm from "./AuthForm";
import AuthFormError from "./AuthFormError";

export default function RegisterForm() {
  const router = useRouter();
  const [formState, action] = useFormState(actions.registerUser, {
    errors: {},
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (formState.success) {
      toast.success("Well done! You have registered successfully.");
      formRef.current?.reset();
      timer = setTimeout(() => {
        router.push(paths.login());
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [formState.success, router]);
  return (
    <AuthForm type="register" formAction={action} formRef={formRef}>
      <AuthFormInputGroup
        name="fullName"
        inputType="text"
        error={formState.errors.name}
      >
        Full name
      </AuthFormInputGroup>
      <AuthFormInputGroup
        name="email"
        inputType="email"
        error={formState.errors.email}
      >
        E-mail
      </AuthFormInputGroup>
      <AuthFormInputGroup
        name="password"
        inputType="password"
        error={formState.errors.password}
      >
        Password
      </AuthFormInputGroup>
      <AuthFormInputGroup
        name="passwordConfirm"
        inputType="password"
        error={formState.errors.passwordConfirm}
      >
        Confirm password
      </AuthFormInputGroup>
      {formState.errors._form ? (
        <AuthFormError>{formState.errors._form?.join(" | ")}</AuthFormError>
      ) : null}
    </AuthForm>
  );
}
