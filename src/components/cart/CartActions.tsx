"use client";

import { CartItem, useCartContext } from "@/app/contexts/CartContext";
import { ProductWithVariant } from "@/models/Product";
import { WishlistItem } from "@/models/User";
import Button from "../ui/Button";
import AddToCart from "./AddToCart";
import UpdateItemQuantity from "./UpdateItemQuantity";

interface CartActionsProps {
  product: ProductWithVariant | WishlistItem | CartItem;
  beforeBackground?: string;
}

export default function CartActions({
  product,
  beforeBackground = "before:bg-white",
}: CartActionsProps) {
  const { getCartStatus } = useCartContext();
  const isInCart = getCartStatus(product.sku);

  return (
    <div className="flex flex-col gap-2">
      {isInCart ? (
        <UpdateItemQuantity product={product as CartItem} />
      ) : (
        <AddToCart product={product as ProductWithVariant | WishlistItem} />
      )}
      <Button type="primary" beforeBackground={beforeBackground}>
        Buy now
      </Button>
    </div>
  );
}
