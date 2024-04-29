"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import AuthForm from "./AuthForm";
import AuthFormInputGroup from "./AuthFormInputGroup";
import AuthFormError from "./AuthFormError";

export default function LoginForm() {
  const [formState, action] = useFormState(actions.signInWithCredentials, {
    errors: {},
  });

  return (
    <AuthForm type="login" formAction={action}>
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
      {formState.errors._form ? (
        <AuthFormError>{formState.errors._form?.join(" | ")}</AuthFormError>
      ) : null}
    </AuthForm>
  );
}
