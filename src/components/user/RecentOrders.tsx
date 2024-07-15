import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import { CartItemSchema } from "@/models/Order";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { PiClock } from "react-icons/pi";
import EmptyItemList from "../admin/EmptyItemList";

interface RecentOrdersProps {
  recentOrderItems: CartItemSchema[];
}

export default function RecentOrders({ recentOrderItems }: RecentOrdersProps) {
  if (!recentOrderItems.length)
    return <EmptyItemList message="You don't have any orders yet" />;

  return (
    <ul className="flex flex-col gap-6">
      {recentOrderItems.map((order) => {
        const {
          title,
          color,
          size,
          sku,
          createdAt,
          image,
          slug,
          quantity,
          price,
        } = order;
        const composedTitle = getProductVariantTitle(title, color, size);
        return (
          <li
            className="grid grid-cols-[3rem_1fr_max-content] mob-sm:grid-cols-[1fr_max-content] gap-5 mob:gap-4"
            key={`${sku}+${createdAt}`}
          >
            <div className="aspect-square relative h-12 w-12 rouned-md mob-sm:hidden">
              <Image
                src={image}
                fill
                alt={composedTitle}
                className="object-cover rounded-md"
                sizes="50vw"
              />
            </div>
            <div className="flex flex-col justify-between">
              <Link
                className="font-semibold hover:underline mb-1"
                href={paths.productShow(slug, sku)}
              >
                {composedTitle}
              </Link>
              <div className="text-zinc-500 text-xs flex items-center gap-3">
                <p>Qty: {quantity}</p>
                <p>{order.category as string}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between text-right">
              <p className="font-semibold">
                {formatCurrency(quantity * price)}
              </p>
              <p className="text-zinc-500 text-xs flex gap-1 items-center">
                <PiClock className="h-4 w-4" />

                {formatDistanceToNowStrict(new Date(createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
