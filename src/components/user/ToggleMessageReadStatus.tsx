"use client";

import { useMessagesContext } from "@/app/contexts/MessagesContext";
import mongoose from "mongoose";
import { useFormStatus } from "react-dom";

interface ToggleMessageReadStatus {
  isRead: boolean;
  id: mongoose.Types.ObjectId;
  onToggle: (id: mongoose.Types.ObjectId) => Promise<void>;
}

export default function ToggleMessageReadStatus({
  isRead,
  onToggle,
  id,
}: ToggleMessageReadStatus) {
  const { pending } = useFormStatus();
  const { setUnreadMessagesCount } = useMessagesContext();
  return (
    <form
      onClick={() =>
        setUnreadMessagesCount((prevCount) =>
          isRead ? prevCount + 1 : prevCount - 1
        )
      }
      action={() => onToggle(id)}
    >
      <button
        className={` ${
          isRead
            ? "bg-zinc-200 hover:bg-zinc-300 focus:bg-zinc-300"
            : "bg-sky-400 hover:bg-sky-500 focus:bg-sky-500"
        } py-1.5 focus:outline-none px-3 rounded-md font-semibold h-8 w-[7.5rem] flex items-center justify-center disabled:opacity-70`}
        disabled={pending}
      >
        {pending ? (
          <span className="form__loader--dark" />
        ) : !isRead ? (
          "Mark As Read"
        ) : (
          "Mark As New"
        )}
      </button>
    </form>
  );
}
