"use client";

import * as actions from "@/actions";
import FormButton from "@/components/FormButton";
import HeadingSecondary from "@/components/HeadingSecondary";
import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formState, action] = useFormState(actions.signInWithCredentials, {
    errors: {},
    success: false,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (formState.success) {
      toast.success("Well done! You have logged in successfully.");
      timer = setTimeout(() => {
        router.push(paths.home());
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [formState.success, router]);
  return (
    <div className="px-8">
      <HeadingSecondary>Login</HeadingSecondary>

      <div className="mx-auto flex justify-center mt-12 p-8 bg-zinc-100 text-zinc-800">
        <form action={action} className="flex flex-col gap-4">
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
          {formState.errors._form ? (
            <p className="bg-red-800 text-red-200">
              {formState.errors._form?.join(" | ")}
            </p>
          ) : null}
          <div className="mt-5">
            <FormButton>Submit</FormButton>
          </div>
        </form>
      </div>
    </div>
  );
}
