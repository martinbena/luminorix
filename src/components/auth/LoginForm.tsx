"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";
import paths from "@/lib/paths";

export default function LoginForm() {
  const [formState, action] = useFormState(actions.signInWithCredentials, {
    errors: {},
  });

  return (
    <div className="flex flex-col gap-8 divide-y-2 child:min-w-96 child:mob:min-w-0">
      <Form formAction={action}>
        <Form.Title textAlign="left">Welcome back!</Form.Title>
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
        {formState.errors._form ? (
          <Form.Error>{formState.errors._form?.join(" | ")}</Form.Error>
        ) : null}
        <Form.Button>Login</Form.Button>
        <p>
          <Link className="underline" href={paths.register()}>
            Don&apos;t have an account yet? Create one here
          </Link>
        </p>
      </Form>

      <GoogleLoginButton />
    </div>
  );
}
