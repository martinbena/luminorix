import { ReactNode } from "react";

interface FormErrorProps {
  children: ReactNode;
}

export default function FormError({ children }: FormErrorProps) {
  return (
    <p className="bg-red-100 px-4 py-3 text-red-700 max-w-96">{children}</p>
  );
}
