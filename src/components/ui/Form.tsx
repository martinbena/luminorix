"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import HeadingSecondary from "./HeadingSecondary";

interface FormProps {
  formAction: (payload: FormData) => void;
  children: ReactNode;
  formRef?: React.Ref<HTMLFormElement>;
}

function Form({ children, formAction, formRef }: FormProps) {
  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-8 font-sans"
    >
      {children}
    </form>
  );
}

interface TitleProps {
  children: ReactNode;
  textAlign?: string;
}

function Title({ children, textAlign = "center" }: TitleProps) {
  return (
    <div className={`mb-4 text-${textAlign}`}>
      <HeadingSecondary>{children}</HeadingSecondary>
    </div>
  );
}

interface SubmitButtonProps {
  children: ReactNode;
  width?: string;
}

function SubmitButton({ children, width }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <div className={`child:w-full ${width}`}>
      <Button
        type="primary"
        beforeBackground="before:bg-white"
        disabled={pending}
      >
        {!pending ? (
          children
        ) : (
          <div className="flex justify-center">
            <div className="form__loader" />
          </div>
        )}
      </Button>
    </div>
  );
}

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <div className="flex justify-center">
      <div className="px-6 py-8 rounded-md shadow-form max-w-2xl w-full">
        {children}
      </div>
    </div>
  );
}

interface ErrorProps {
  children: ReactNode;
}

function Error({ children }: ErrorProps) {
  return (
    <p className="bg-red-100 px-4 py-3 text-red-700 max-w-96">{children}</p>
  );
}

interface InputGroupProps {
  name: string;
  inputType: string;
  placeholder?: string;
  error: string[] | undefined;
  children: ReactNode;
}

function InputGroup({
  name,
  inputType,
  placeholder,
  error,
  children,
}: InputGroupProps) {
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
      {error && <Error>{error?.join(" | ")}</Error>}
    </div>
  );
}

interface RowProps {
  children: ReactNode;
  numColumns: number;
}

function Row({ numColumns, children }: RowProps) {
  <div className={`grid grid-cols-${numColumns}`}>{children}</div>;
}

Form.Container = Container;
Form.Title = Title;
Form.Row = Row;
Form.InputGroup = InputGroup;
Form.Error = Error;
Form.Button = SubmitButton;

export default Form;
