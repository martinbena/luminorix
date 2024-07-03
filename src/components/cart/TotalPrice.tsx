"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import { SHIPPING_RATE } from "@/lib/constants";
import { formatCurrency } from "@/lib/helpers";

export default function TotalPrice() {
  const {
    getTotalCartPrice,
    getTotalCartQuantity,
    getShippingStatus,
    discountCoupon,
    getDiscountedAmount,
  } = useCartContext();

  const totalCartItemsQuantity = getTotalCartQuantity();
  const totalCartPrice = getTotalCartPrice();
  const isShippingFree = getShippingStatus();
  const couponDiscountAmount = getDiscountedAmount();

  return (
    <div className="flex flex-col gap-2 my-4 font-sans">
      {discountCoupon ? (
        <div className="flex justify-between gap-4 bg-amber-100 py-3 px-4 font-semibold">
          <div className="flex flex-col gap-1">
            <p>{discountCoupon.code}</p>
            <p>{discountCoupon.coupon.name}</p>
          </div>
          <p className="mt-auto text-base text-nowrap">
            {`- ${formatCurrency(couponDiscountAmount)}`}
          </p>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <p>Shipping:</p>{" "}
        <p className="text-lg">
          {formatCurrency(isShippingFree ? 0 : SHIPPING_RATE)}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-base">
          Total <span className="font-semibold">{totalCartItemsQuantity}</span>{" "}
          {totalCartItemsQuantity > 1 ? "items" : "item"}:
        </p>
        <p>
          <span className="text-2xl font-medium">
            {formatCurrency(
              isShippingFree ? totalCartPrice : totalCartPrice + SHIPPING_RATE
            )}
          </span>
          <span className="block text-right text-zinc-500 font-medium">
            (tax incl.)
          </span>
        </p>
      </div>
    </div>
  );
}
