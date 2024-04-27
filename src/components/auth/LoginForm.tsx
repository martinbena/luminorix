"use client";

import FormButton from "@/components/FormButton";
import { signIn } from "next-auth/react";
import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as actions from "@/actions";

export default function LoginForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setFormError("Invalid e-mail or password");
    } else {
      setFormError("");
      toast.success("Well done! You have logged in successfully.");
      router.push(paths.home());
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-2">
          <label className="w-32" htmlFor="email">
            E-mail:
          </label>{" "}
          <input id="email" name="email" type="email" ref={emailInputRef} />
          <p className="bg-red-800 text-red-200"></p>
        </div>
        <div className="flex gap-2">
          <label className="w-32" htmlFor="password">
            Password:
          </label>{" "}
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordInputRef}
          />
          <p className="bg-red-800 text-red-200"></p>
        </div>
        {formError.length > 0 ? (
          <p className="bg-red-800 text-red-200">Invalid e-mail or password</p>
        ) : null}
        <div className="mt-5">
          <FormButton>Submit</FormButton>
        </div>
      </form>
      <form action={actions.signInWithGoogle}>
        <button type="submit">Sign In With Google</button>
      </form>
    </>
  );
}
