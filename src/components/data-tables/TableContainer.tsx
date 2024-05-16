import { ReactNode } from "react";

interface TableContainerProps {
  children: ReactNode;
}

export default function TableContainer({ children }: TableContainerProps) {
  return (
    <div className="flex justify-center mx-auto">{children}</div>
  );
}
