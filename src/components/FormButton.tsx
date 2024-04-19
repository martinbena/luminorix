"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  children: ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {!pending ? children : "Submitting..."}
    </button>
  );
}
