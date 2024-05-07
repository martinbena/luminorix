import { ReactNode } from "react";

interface TableHeaderProps {
  children: ReactNode;
  numColumns?: string;
}

export default function TableHeader({
  numColumns = "grid-cols-[1fr_max-content]",
  children,
}: TableHeaderProps) {
  return (
    <header
      role="row"
      className={`bg-amber-100 rounded-t-md uppercase font-semibold tracking-wide border-b border-zinc-100 px-6 py-4 grid ${numColumns} gap-x-6 items-center`}
    >
      {children}
    </header>
  );
}
