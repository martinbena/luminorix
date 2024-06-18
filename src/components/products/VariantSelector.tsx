import { ReactNode } from "react";

interface VariantSelectorProps {
  criterion: string;
  children: ReactNode;
}

export default function VariantSelector({
  criterion,
  children,
}: VariantSelectorProps) {
  return (
    <div>
      <p className="font-semibold mb-6">{criterion}</p>
      <div className="flex gap-6">{children}</div>
    </div>
  );
}
