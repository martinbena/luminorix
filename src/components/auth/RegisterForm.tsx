"use client";

import * as actions from "@/actions";
import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import Form from "../ui/Form";
import Link from "next/link";

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
    <Form formAction={action} formRef={formRef}>
      <Form.Title textAlign="left">Register to manage your orders</Form.Title>
      <Form.InputGroup
        name="fullName"
        inputType="text"
        error={formState.errors.name}
      >
        Full name
      </Form.InputGroup>
      <Form.InputGroup
        name="email"
        inputType="email"
        error={formState.errors.email}
      >
        E-mail
      </Form.InputGroup>
      <Form.InputGroup
        name="password"
        inputType="password"
        error={formState.errors.password}
      >
        Password
      </Form.InputGroup>
      <Form.InputGroup
        name="passwordConfirm"
        inputType="password"
        error={formState.errors.passwordConfirm}
      >
        Confirm password
      </Form.InputGroup>
      {formState.errors._form ? (
        <Form.Error>{formState.errors._form?.join(" | ")}</Form.Error>
      ) : null}
      <Form.Button>Register</Form.Button>
      <p>
        <Link className="underline" href={paths.login()}>
          Already have an account? Login here
        </Link>
      </p>
    </Form>
  );
}
