"use client";

import { ChangeEvent, ReactNode, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import HeadingSecondary from "./HeadingSecondary";
import Image from "next/image";

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
  type?: "primary" | "secondary" | "tertiary";
}

function SubmitButton({ children, width, type }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <div className={`child:w-full ${width}`}>
      <Button
        type={type ?? "primary"}
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
  value?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

function InputGroup({
  name,
  inputType,
  placeholder,
  error,
  children,
  value,
  inputRef,
}: InputGroupProps) {
  const commonProps = {
    id: name,
    name,
    placeholder,
    defaultValue: value,
    className: `${
      inputType === "checkbox" ? "accent-amber-400 h-4 w-4" : ""
    } border text-base focus:outline-none max-w-full px-4 py-3 ${
      error
        ? "border-red-600 focus:border-red-600"
        : "border-zinc-300 focus:border-zinc-700"
    }`,
  };
  return (
    <div
      className={`${
        inputType === "checkbox"
          ? "gap-2 [&>*:nth-child(1)]:order-2 items-center"
          : "flex-col gap-4"
      } flex `}
    >
      <label className={`${error ? "text-red-600" : ""}`} htmlFor={name}>
        {children}
      </label>{" "}
      {inputType === "textarea" ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input type={inputType} {...commonProps} ref={inputRef} />
      )}
      {error && <Error>{error?.join(" | ")}</Error>}
    </div>
  );
}

interface ImagePickerProps {
  name: string;
}

function ImagePicker({ name }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  function handlePickClick() {
    imageInput.current?.click();
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setPickedImage(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  }

  return (
    <div>
      <div className=" flex items-start gap-6 mb-4">
        <div className="w-40 h-40 border-2 border-zinc-400 flex justify-center items-center text-center relative">
          {!pickedImage && <p className="m-0 p-1">No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              className="object-cover"
              fill
            />
          )}
        </div>
        <input
          className="hidden"
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
        />
        <Button type="secondary" onClick={handlePickClick}>
          Pick Image
        </Button>
      </div>
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
Form.ImagePicker = ImagePicker;
Form.Error = Error;
Form.Button = SubmitButton;

export default Form;
