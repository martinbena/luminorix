"use client";

import { CartItem, useCartContext } from "@/app/contexts/CartContext";
import { ProductWithVariant } from "@/models/Product";
import { WishlistItem } from "@/models/User";
import Button from "../ui/Button";
import AddToCart from "./AddToCart";
import UpdateItemQuantity from "./UpdateItemQuantity";

export interface CartActionsProps {
  product: ProductWithVariant | WishlistItem | CartItem;
  background?: string;
}

export default function CartActions({
  product,
  background = "white",
}: CartActionsProps) {
  const { getCartStatus } = useCartContext();
  const isInCart = getCartStatus(product.sku);

  return (
    <div className="flex flex-col gap-2">
      {isInCart ? (
        <UpdateItemQuantity product={product} />
      ) : (
        <AddToCart product={product} />
      )}
      <Button type="primary" beforeBackground={`before:bg-${background}`}>
        Buy now
      </Button>
    </div>
  );
}
