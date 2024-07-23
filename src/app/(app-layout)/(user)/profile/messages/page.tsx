import HeadingSecondary from "@/components/ui/HeadingSecondary";
import MessageList from "@/components/user/MessageList";
import MessagesSkeleton from "@/components/user/MessagesSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Messages",
};

export default function UserMessagesPage() {
  return (
    <section className="max-w-5xl mx-auto">
      <HeadingSecondary>Messages</HeadingSecondary>
      <Suspense fallback={<MessagesSkeleton />}>
        <MessageList />
      </Suspense>
    </section>
  );
}
