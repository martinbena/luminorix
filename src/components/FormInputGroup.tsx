import { ReactNode } from "react";
import FormError from "./FormError";

interface FormGroupProps {
  name: string;
  inputType: string;
  placeholder?: string;
  error: string[] | undefined;
  children: ReactNode;
}

export default function FormInputGroup({
  name,
  inputType,
  placeholder,
  error,
  children,
}: FormGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className={`${error ? "text-red-600" : ""}`} htmlFor={name}>
        {children}
      </label>{" "}
      <input
        id={name}
        name={name}
        type={inputType}
        placeholder={placeholder}
        className={`auth-form__input border text-base focus:outline-none max-w-full min-w-96 mob-lg:min-w-0 px-4 py-3 ${
          error
            ? "border-red-600 focus:border-red-600"
            : "border-zinc-300 focus:border-zinc-700"
        }`}
      />
      {error && <FormError>{error?.join(" | ")}</FormError>}
    </div>
  );
}
