import { ReactNode } from "react";

interface AuthFormErrorProps {
  children: ReactNode;
}

export default function AuthFormError({ children }: AuthFormErrorProps) {
  return (
    <p className="bg-red-100 px-4 py-3 text-red-700 max-w-96">{children}</p>
  );
}
