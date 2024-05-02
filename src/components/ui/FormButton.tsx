"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import Button from "./Button";

interface FormButtonProps {
  children: ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="primary"
      beforeBackground="before:bg-white"
      disabled={pending}
    >
      {!pending ? children : "Submitting..."}
    </Button>
  );
}
