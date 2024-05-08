import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

export default function Modal({ children }: ModalProps) {
  return (
    <div className="min-w-72 p-8 bg-white shadow-form rounded-md">
      {children}
    </div>
  );
}
