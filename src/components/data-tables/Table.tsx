import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
}

export default function Table({ children }: TableProps) {
  return (
    <div
      role="table"
      className="rounded-md border border-zinc-200 font-sans mt-16 max-w-2xl w-full"
    >
      {children}
    </div>
  );
}
