import { ReactNode } from "react";

interface ItemTitleProps {
  children: ReactNode;
}

export default function ItemTitle({ children }: ItemTitleProps) {
  return <div className="font-semibold tracking-wide">{children}</div>;
}
