"use client";

import * as actions from "@/actions";
import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import FormInputGroup from "../ui/FormInputGroup";
import AuthForm from "./AuthForm";
import FormError from "../ui/FormError";

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
      <FormInputGroup
        name="fullName"
        inputType="text"
        error={formState.errors.name}
      >
        Full name
      </FormInputGroup>
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
      <FormInputGroup
        name="passwordConfirm"
        inputType="password"
        error={formState.errors.passwordConfirm}
      >
        Confirm password
      </FormInputGroup>
      {formState.errors._form ? (
        <FormError>{formState.errors._form?.join(" | ")}</FormError>
      ) : null}
    </AuthForm>
  );
}
