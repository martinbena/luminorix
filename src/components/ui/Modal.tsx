import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

export default function Modal({ children }: ModalProps) {
  return (
    <div className="min-w-96 p-8 bg-white shadow-form rounded-md text-zinc-800">
      {children}
    </div>
  );
}
