import HeadingSecondary from "@/components/ui/HeadingSecondary";
import Messages from "@/components/user/Messages";
import MessagesSkeleton from "@/components/user/MessagesSkeleton";
import { Suspense } from "react";

export default function UserMessagesPage() {
  return (
    <section className="max-w-5xl mx-auto">
      <HeadingSecondary>Messages</HeadingSecondary>
      <Suspense fallback={<MessagesSkeleton />}>
        <Messages />
      </Suspense>
    </section>
  );
}
