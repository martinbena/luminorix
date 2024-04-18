"use client";

import * as actions from "@/actions";
import HeadingSecondary from "@/components/HeadingSecondary";
import { useFormState } from "react-dom";

export default function RegisterPage() {
  const [formState, action] = useFormState(actions.registerUser, {
    errors: {},
  });
  return (
    <div className="px-8">
      <HeadingSecondary>Register</HeadingSecondary>

      <div className="mx-auto flex justify-center mt-12 p-8 bg-zinc-100 text-zinc-800">
        <form action={action} className="flex flex-col gap-4">
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
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
            />
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
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
