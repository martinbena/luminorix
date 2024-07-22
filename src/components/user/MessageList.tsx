import { auth } from "@/auth";
import { getMessages } from "@/db/queries/messages";
import EmptyItemList from "../admin/EmptyItemList";
import { PiBell } from "react-icons/pi";
import Messages from "./Messages";

export default async function MessageList() {
  const session = await auth();
  const { messages, unreadCount } = await getMessages(
    session!.user._id.toString()
  );

  if (!messages.length)
    return (
      <div className="mt-12">
        <EmptyItemList
          icon={<PiBell />}
          message="You do not have any messages right now"
        />
      </div>
    );
  return (
    <ul className="mt-12 flex flex-col gap-4">
      <Messages
        messages={JSON.parse(JSON.stringify(messages))}
        dbUnreadCount={unreadCount}
      />
    </ul>
  );
}
