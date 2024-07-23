"use client";

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import HeadingSecondary from "./HeadingSecondary";
import Image from "next/image";
import { Document } from "mongoose";
import { FaStarOfLife } from "react-icons/fa";
import ButtonIcon from "./ButtonIcon";
import { PiXThin } from "react-icons/pi";

interface FormProps {
  formAction: (payload: FormData) => void;
  children: ReactNode;
  formRef?: React.Ref<HTMLFormElement>;
  onClick?: () => void;
}

function Form({ children, formAction, formRef, onClick }: FormProps) {
  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-8 font-sans"
      onClick={onClick ?? undefined}
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
  type?: "primary" | "secondary" | "tertiary" | "small";
  isDisabled?: boolean;
}

function SubmitButton({
  children,
  width,
  type,
  isDisabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  if (type === "small")
    return (
      <button
        className="py-1 px-2 min-h-7 min-w-20 focus:outline-none focus:bg-sky-600 bg-sky-700 w-full hover:bg-sky-600 text-white rounded-md uppercase font-semibold disabled:opacity-75"
        disabled={pending || isDisabled}
      >
        {!pending ? (
          children
        ) : (
          <div className="flex justify-center">
            <div className="form__loader" />
          </div>
        )}
      </button>
    );

  return (
    <div className={`child:w-full ${width}`}>
      <Button
        type={type ?? "primary"}
        beforeBackground="before:bg-white"
        disabled={pending || isDisabled}
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
      <div className="px-6 py-8 rounded-md shadow-form max-w-2xl w-full bg-white">
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

type Option = Document & { title: string };
type SelectOption = Option | string;

interface InputGroupProps {
  name: string;
  inputType: string;
  placeholder?: string;
  error: string[] | undefined;
  children?: ReactNode;
  value?: string | number;
  inputRef?: React.RefObject<HTMLInputElement>;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  options?: SelectOption[];
  optionalField?: boolean;
  step?: number;
  checked?: boolean;
  isReadOnly?: boolean;
}

function InputGroup({
  name,
  inputType,
  placeholder,
  error,
  children,
  value,
  inputRef,
  textareaRef,
  options,
  optionalField = false,
  step,
  checked,
  isReadOnly,
}: InputGroupProps) {
  const commonProps = {
    id: name,
    name,
    placeholder,
    defaultValue: value,
    className: `${
      isReadOnly ? "cursor-not-allowed bg-zinc-100" : ""
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
      {children && (
        <label
          className={`${!optionalField ? "flex" : ""} ${
            error ? "text-red-600" : ""
          }`}
          htmlFor={name}
        >
          <span>{children}</span>{" "}
          {!optionalField ? (
            <span>
              {" "}
              <FaStarOfLife className="ml-1 h-1.5 w-1.5 text-red-500" />{" "}
            </span>
          ) : null}
        </label>
      )}{" "}
      {inputType === "textarea" ? (
        <textarea {...commonProps} rows={4} ref={textareaRef} />
      ) : inputType === "select" ? (
        <select {...commonProps}>
          {options?.map((option) =>
            typeof option === "string" ? (
              <option key={option} value={option}>
                {option}
              </option>
            ) : (
              <option key={option._id} value={option._id}>
                {option.title}
              </option>
            )
          )}
        </select>
      ) : (
        <input
          type={inputType}
          step={inputType === "number" ? step : undefined}
          {...commonProps}
          ref={inputRef}
          {...(inputType === "checkbox" ? { defaultChecked: checked } : {})}
          {...((inputType === "text" ||
            inputType === "password" ||
            inputType === "email") &&
          isReadOnly
            ? { readOnly: true }
            : {})}
        />
      )}
      {error && <Error>{error?.join(" | ")}</Error>}
    </div>
  );
}

interface ImagePickerProps {
  name: string;
  error: string[] | undefined;
  optionalField?: boolean;
  isReset: boolean;
  isDisabled?: boolean;
}

function ImagePicker({
  name,
  error,
  optionalField = false,
  isReset,
  isDisabled,
}: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  function handlePickClick() {
    imageInput.current?.click();
  }

  useEffect(() => {
    if (isReset) {
      handleReset();
    }
  }, [isReset]);

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

  function handleReset(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.stopPropagation();
    setPickedImage(null);
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`${!optionalField ? "flex" : ""} ${
          error ? "text-red-600" : ""
        }`}
        htmlFor={name}
      >
        <span>Image</span>{" "}
        {!optionalField ? (
          <span>
            {" "}
            <FaStarOfLife className="ml-1 h-1.5 w-1.5 text-red-500" />{" "}
          </span>
        ) : null}
      </label>
      <div className="flex items-start gap-6 mb-4 mob:flex-col">
        <div className="w-40 h-40 border-2 border-zinc-400 flex justify-center items-center text-center relative">
          {!pickedImage && (
            <p className={`${error ? "text-red-600" : ""} m-0 p-1`}>
              No image picked yet.
            </p>
          )}
          {pickedImage && (
            <>
              <Image
                src={pickedImage}
                alt="The image selected by the user."
                className="object-cover"
                fill
              />
              <div className="absolute top-1 right-1 text-red-600">
                <ButtonIcon variant="small" onClick={handleReset}>
                  <PiXThin />
                </ButtonIcon>
              </div>
            </>
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
          disabled={isDisabled}
        />
        <Button
          disabled={isDisabled}
          type="secondary"
          onClick={handlePickClick}
        >
          Pick Image
        </Button>
      </div>
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
Form.ImagePicker = ImagePicker;
Form.Error = Error;
Form.Button = SubmitButton;

export default Form;
