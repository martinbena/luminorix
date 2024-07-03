"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import { Category } from "@/models/Category";
import CartItem from "./CartItem";

interface CartItemsProps {
  type: string;
}

export default function CartItems({ type = "cart" }) {
  const { cartItems } = useCartContext();

  return (
    <ul className="flex flex-col gap-4">
      {cartItems
        .slice()
        .sort((a, b) => {
          const titleA = (a.category as Category).title;
          const titleB = (b.category as Category).title;
          return titleA.localeCompare(titleB);
        })
        .map((item) => {
          return <CartItem type={type} key={item.sku} item={item} />;
        })}
    </ul>
  );
}

//  <ul className="flex flex-col gap-4">
//    {cartItems
//      .slice()
//      .sort((a, b) => {
//        const titleA = (a.category as Category).title;
//        const titleB = (b.category as Category).title;
//        return titleA.localeCompare(titleB);
//      })
//      .map((item) => {
//        const composedTitle = getProductVariantTitle(
//          item.title,
//          item.color,
//          item.size
//        );
//        const isDiscount =
//          discountCoupon &&
//          (item.category as Category).title ===
//            discountCoupon?.metadata.category;
//        return (
//          <li
//            key={item.sku}
//            className="flex gap-6 border border-zinc-300 rounded-md p-2"
//          >
//            <div className="relative aspect-square w-16">
//              <Image
//                src={item.image}
//                alt={composedTitle}
//                fill
//                className="object-cover"
//              />
//            </div>

//            <div className="flex flex-col justify-between flex-1">
//              <h4>{composedTitle}</h4>
//              <div className="flex items-center justify-between">
//                <p
//                  className={`font-sans text-base ${
//                    isDiscount ? "text-amber-700" : ""
//                  }`}
//                >
//                  {formatCurrency(item.price)}
//                </p>
//                <p className="text-zinc-500">Qty: {item.quantity}</p>
//              </div>
//            </div>
//          </li>
//        );
//      })}
//  </ul>;
