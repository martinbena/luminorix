import { ReactElement } from "react";
import { TfiNotepad } from "react-icons/tfi";

interface EmptyItemListProps {
  message: string;
  icon?: ReactElement;
}

export default function EmptyItemList({ message, icon }: EmptyItemListProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 [&>*:nth-child(1)]:text-zinc-300 [&>*:nth-child(1)]:h-24 [&>*:nth-child(1)]:w-24">
      {icon ?? <TfiNotepad />}
      <p className="text-lg">{message}</p>
    </div>
  );
}
