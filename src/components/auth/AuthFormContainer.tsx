import { ReactNode } from "react";

interface AuthFormContainerProps {
  children: ReactNode;
}

export default function AuthFormContainer({
  children,
}: AuthFormContainerProps) {
  return (
    <div className="bg-white px-24 py-12 mob-lg:p-12 mob-sm:p-6">
      {children}
    </div>
  );
}
