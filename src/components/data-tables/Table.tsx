import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  maxWidth: string;
}

export default function Table({ children, maxWidth }: TableProps) {
  return (
    <div
      role="table"
      className={`rounded-md border border-zinc-200 font-sans mt-16 ${maxWidth} w-full`}
    >
      {children}
    </div>
  );
}
