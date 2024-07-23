import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import { CartItemSchema } from "@/models/Order";
import Image from "next/image";
import { ItemTitle } from "../data-tables/Table";
import paths from "@/lib/paths";
import Link from "next/link";

interface UserOrderItemProps {
  orderItem: CartItemSchema;
}

export default function UserOrderItem({ orderItem }: UserOrderItemProps) {
  const { image, title, color, size, slug, sku, price, quantity } = orderItem;
  const composedTitle = getProductVariantTitle(title, color, size);
  return (
    <>
      {" "}
      <div className="w-16 h-16 mob-sm:w-8 mob-sm:h-8 relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={`Image of ${composedTitle}`}
          className="object-cover"
          fill
          sizes="50vw"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <ItemTitle>
          <Link
            className="text-amber-700 hover:underline focus:outline-none focus:underline"
            href={paths.productShow(slug, sku)}
          >
            {" "}
            {composedTitle}
          </Link>
        </ItemTitle>
        <div className="">
          Qty: {quantity} for{" "}
          <span className="font-semibold">
            {formatCurrency(quantity * price)}
          </span>
        </div>
      </div>
    </>
  );
}
