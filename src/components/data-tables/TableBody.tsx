import { ReactNode } from "react";

interface TableBodyProps {
  children: ReactNode;
}

export default function TableBody({ children }: TableBodyProps) {
  return <section className="mt-2">{children}</section>;
}
