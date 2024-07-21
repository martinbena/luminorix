import { useFormStatus } from "react-dom";

interface ToggleMessageReadStatus {
  isRead: boolean;
}

export default function ToggleMessageReadStatus({
  isRead,
}: ToggleMessageReadStatus) {
  const { pending } = useFormStatus();
  return (
    <button
      className={` ${
        isRead ? "bg-zinc-200 hover:bg-zinc-300" : "bg-sky-400 hover:bg-sky-500"
      } py-1.5 px-3 rounded-md font-semibold h-8 w-[7.125rem] flex items-center justify-center disabled:opacity-70`}
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
  );
}
