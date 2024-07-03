import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import UpdateItemQuantity from "./UpdateItemQuantity";
import {
  CartItem as CartItemType,
  useCartContext,
} from "@/app/contexts/CartContext";
import { Category } from "@/models/Category";

interface CartItemProps {
  item: CartItemType;
  type: string;
}

export default function CartItem({ item, type = "cart" }: CartItemProps) {
  const { discountCoupon } = useCartContext();
  const isDiscount =
    discountCoupon &&
    (item.category as Category).title === discountCoupon?.metadata.category;
  const composedTitle = getProductVariantTitle(
    item.title,
    item.color,
    item.size
  );

  return (
    <li className="flex gap-6 tab-lg:gap-4 border border-zinc-300 rounded-md p-2">
      <div
        className={`relative aspect-square ${
          type === "cart" ? "w-48 mob-sm:w-16 mob-sm:h-16" : "w-16"
        }`}
      >
        <Image
          src={item.image}
          alt={composedTitle}
          fill
          className="object-cover"
        />
      </div>
      <div
        className={`flex flex-col justify-between flex-1 ${
          type === "cart" ? "" : ""
        } `}
      >
        {type === "cart" && (
          <>
            <div>
              <h3 className="hover:underline text-xl font-semibold mob:text-lg mob-sm:text-base">
                <Link href={paths.productShow(item.slug, item.sku)}>
                  {composedTitle}
                </Link>
              </h3>
              <div
                className={`mt-7 mob:mt-3 mob:mb-6 font-sans text-lg mob:text-base flex justify-between items-center gap-2 ${
                  isDiscount ? "text-amber-700" : ""
                }`}
              >
                <p>{formatCurrency(item.price)}</p>
                {isDiscount ? (
                  <p className="bg-amber-100 px-2 py-1 text-zinc-800 font-medium">
                    {" "}
                    <span>
                      {" "}
                      {`- ${discountCoupon.coupon.percent_off}%`}
                    </span>{" "}
                    <span className="text-xs mob:hidden">{`(${discountCoupon.code})`}</span>
                  </p>
                ) : null}
              </div>
            </div>
            <UpdateItemQuantity product={item} />
          </>
        )}
        {type === "summary" && (
          <>
            {" "}
            <h4>{composedTitle}</h4>{" "}
            <div className="flex items-center justify-between">
              <p
                className={`font-sans text-base ${
                  isDiscount ? "text-amber-700" : ""
                }`}
              >
                {formatCurrency(item.price)}
              </p>
              <p className="text-zinc-500">Qty: {item.quantity}</p>
            </div>{" "}
          </>
        )}
      </div>
    </li>
  );
}
