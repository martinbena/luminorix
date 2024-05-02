"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import AuthForm from "./AuthForm";
import FormInputGroup from "../ui/FormInputGroup";
import FormError from "../ui/FormError";

export default function LoginForm() {
  const [formState, action] = useFormState(actions.signInWithCredentials, {
    errors: {},
  });

  return (
    <AuthForm type="login" formAction={action}>
      <FormInputGroup
        name="email"
        inputType="email"
        error={formState.errors.email}
      >
        E-mail
      </FormInputGroup>
      <FormInputGroup
        name="password"
        inputType="password"
        error={formState.errors.password}
      >
        Password
      </FormInputGroup>
      {formState.errors._form ? (
        <FormError>{formState.errors._form?.join(" | ")}</FormError>
      ) : null}
    </AuthForm>
  );
}
