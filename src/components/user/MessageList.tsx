import { auth } from "@/auth";
import { getMessages } from "@/db/queries/messages";
import Messages from "./Messages";

export default async function MessageList() {
  const session = await auth();
  const { messages, unreadCount } = await getMessages(
    session!.user._id.toString()
  );

  return (
    <Messages
      messages={JSON.parse(JSON.stringify(messages))}
      dbUnreadCount={unreadCount}
    />
  );
}
