"use client";

import * as actions from "@/actions";
import { formatCurrency } from "@/lib/helpers";
import { Message } from "@/models/Message";
import { format } from "date-fns";
import Image from "next/image";
import { ReactNode, useEffect, useOptimistic } from "react";
import mongoose from "mongoose";
import { useMessagesContext } from "@/app/contexts/MessagesContext";
import ToggleMessageReadStatus from "./ToggleMessageReadStatus";
import DeleteMessage from "./DeleteMessage";

interface MessagesProps {
  messages: Message[];
  dbUnreadCount: number;
}

export default function Messages({ messages, dbUnreadCount }: MessagesProps) {
  const [optimisticMessages, updateOptimisticMessages] = useOptimistic(
    messages,
    (
      prevMessages: Message[],
      updatedMessageId: mongoose.Types.ObjectId
    ): Message[] => {
      const updatedMessageIndex = prevMessages.findIndex(
        (message) => message._id === updatedMessageId
      );

      if (updatedMessageIndex === -1) {
        return prevMessages;
      }

      const updatedMessage = { ...prevMessages[updatedMessageIndex] };
      updatedMessage.read = !updatedMessage.read;
      const newMessages = [...prevMessages];
      newMessages[updatedMessageIndex] = updatedMessage;

      return newMessages;
    }
  );

  const { unreadMessagesCount, setUnreadMessagesCount } = useMessagesContext();

  useEffect(() => {
    if (dbUnreadCount !== unreadMessagesCount) {
      const timeoutId = setTimeout(() => {
        if (dbUnreadCount !== unreadMessagesCount) {
          setUnreadMessagesCount(dbUnreadCount);
        }
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [dbUnreadCount, unreadMessagesCount, setUnreadMessagesCount]);

  async function handleToggleReadStatus(id: mongoose.Types.ObjectId) {
    updateOptimisticMessages(id);
    await actions.toggleMessageReadStatus(id);
  }

  return (
    <>
      {optimisticMessages.map((message) => {
        const {
          _id: id,
          marketItem,
          text,
          sender,
          phone,
          createdAt,
          read: isRead,
        } = message;
        return (
          <li
            key={id.toString()}
            className="relative bg-white p-4 mob-lg:py-5 rounded-md border border-zinc-200 font-sans"
          >
            {!isRead && (
              <div className="absolute top-2 right-2 text-base mob-lg:text-xs mob-lg:top-0.5 mob-lg:right-0.5 bg-amber-500 text-white px-2 py-1 rounded-md">
                New
              </div>
            )}
            <h2 className="text-xl mb-4">
              <span className="font-bold">Market Item Inquiry:</span>{" "}
              {marketItem.product.title} for{" "}
              <span className="font-medium">
                {formatCurrency(marketItem.price)}
              </span>
            </h2>
            <p className="text-zinc-700 text-base">{text}</p>

            <ul className="mt-4 flex flex-col gap-1">
              <MessageInfo title="from">
                <div className="flex items-center gap-2">
                  {typeof sender.image === "string" && sender.image.length && (
                    <Image
                      src={sender.image}
                      alt={`Image of ${sender.name}`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{sender.name}</span>
                </div>
              </MessageInfo>
              <MessageInfo title="Reply email">
                {" "}
                <a
                  href={`mailto:${sender.email}`}
                  className="text-blue-500 hover:underline focus:outline-none focus:underline"
                >
                  {sender.email}
                </a>{" "}
              </MessageInfo>
              {phone && (
                <MessageInfo title="Reply phone">
                  {" "}
                  <a
                    href={`tel:${phone}`}
                    className="text-blue-500 hover:underline focus:outline-none focus:underline"
                  >
                    {phone}
                  </a>
                </MessageInfo>
              )}
              <MessageInfo title="Received">
                {format(new Date(createdAt), "MMM d, yyyy, h:mm a")}
              </MessageInfo>
            </ul>
            <div className="flex gap-3 mt-4">
              <ToggleMessageReadStatus
                id={id}
                onToggle={handleToggleReadStatus}
                isRead={isRead}
              />
              <DeleteMessage message={message} />
            </div>
          </li>
        );
      })}
    </>
  );
}

interface MessageInfoProps {
  title: string;
  children: ReactNode;
}

function MessageInfo({ title, children }: MessageInfoProps) {
  return (
    <li className="font-medium flex items-center gap-2">
      <span className="font-bold capitalize">{title}:</span> {children}
    </li>
  );
}
