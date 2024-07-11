import { TfiNotepad } from "react-icons/tfi";

interface EmptyItemListProps {
  message: string;
}

export default function EmptyItemList({ message }: EmptyItemListProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <TfiNotepad className="text-zinc-300 h-24 w-24" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
