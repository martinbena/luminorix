import { auth } from "@/auth";
import { getMessages } from "@/db/queries/messages";
import { formatCurrency } from "@/lib/helpers";
import { format } from "date-fns";
import Image from "next/image";
import { ReactNode } from "react";
import MessageActions from "./MessageActions";
import EmptyItemList from "../admin/EmptyItemList";
import { PiBell } from "react-icons/pi";

export default async function Messages() {
  const session = await auth();
  const messages = await getMessages(session!.user._id.toString());

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
    <div className="mt-12 flex flex-col gap-4">
      {messages.map((message) => {
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
          <div
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
                  className="text-blue-500 hover:underline"
                >
                  {sender.email}
                </a>{" "}
              </MessageInfo>
              {phone && (
                <MessageInfo title="Reply phone">
                  {" "}
                  <a
                    href={`tel:${phone}`}
                    className="text-blue-500 hover:underline"
                  >
                    {phone}
                  </a>
                </MessageInfo>
              )}
              <MessageInfo title="Received">
                {format(new Date(createdAt), "MMM d, yyyy, h:mm a")}
              </MessageInfo>
            </ul>
            <MessageActions message={message} />
          </div>
        );
      })}
    </div>
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
