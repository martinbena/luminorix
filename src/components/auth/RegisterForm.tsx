"use client";

import * as actions from "@/actions";
import FormButton from "@/components/FormButton";
import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

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
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [formState.success, router]);
  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <label className="w-32" htmlFor="fullName">
          Full name:
        </label>{" "}
        <input id="fullName" name="fullName" type="text" />
        <p className="bg-red-800 text-red-200">
          {formState.errors.name?.join(" | ")}
        </p>
      </div>
      <div className="flex gap-2">
        <label className="w-32" htmlFor="email">
          E-mail:
        </label>{" "}
        <input id="email" name="email" type="email" />
        <p className="bg-red-800 text-red-200">
          {formState.errors.email?.join(" | ")}
        </p>
      </div>
      <div className="flex gap-2">
        <label className="w-32" htmlFor="password">
          Password:
        </label>{" "}
        <input id="password" name="password" type="password" />
        <p className="bg-red-800 text-red-200">
          {formState.errors.password?.join(" | ")}
        </p>
      </div>
      <div className="flex gap-2">
        <label className="w-32" htmlFor="passwordConfirm">
          Confirm password:
        </label>{" "}
        <input id="passwordConfirm" name="passwordConfirm" type="password" />
        <p className="bg-red-800 text-red-200">
          {formState.errors.passwordConfirm?.join(" | ")}
        </p>
      </div>
      {formState.errors._form ? (
        <p className="bg-red-800 text-red-200">
          {formState.errors._form?.join(" | ")}
        </p>
      ) : null}
      <div className="mt-5">
        <FormButton>Submit</FormButton>
      </div>
    </form>
  );
}
