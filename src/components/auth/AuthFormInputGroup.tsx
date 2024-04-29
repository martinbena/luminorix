import { ReactNode } from "react";
import AuthFormError from "./AuthFormError";

interface AuthFormGroupProps {
  name: string;
  inputType: string;
  error: string[] | undefined;
  children: ReactNode;
}

export default function AuthFormInputGroup({
  name,
  inputType,
  error,
  children,
}: AuthFormGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className={`${error ? "text-red-600" : ""}`} htmlFor={name}>
        {children}
      </label>{" "}
      <input
        id={name}
        name={name}
        type={inputType}
        className={`auth-form__input border text-base focus:outline-none max-w-full min-w-96 mob-lg:min-w-0 px-4 py-3 ${
          error
            ? "border-red-600 focus:border-red-600"
            : "border-zinc-300 focus:border-zinc-700"
        }`}
      />
      {error && <AuthFormError>{error?.join(" | ")}</AuthFormError>}
    </div>
  );
}
