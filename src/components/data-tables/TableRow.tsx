import { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  numColumns?: string;
}

export default function TableRow({
  numColumns = "grid-cols-[1fr_max-content]",
  children,
}: TableRowProps) {
  return (
    <div
      role="row"
      className={`grid ${numColumns} gap-6 items-center px-6 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100 mob-lg:px-3 mob-lg:py-2 mob-lg:gap-4`}
    >
      {children}
    </div>
  );
}
