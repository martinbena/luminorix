"use client";

import { ProductWithVariant } from "@/models/Product";
import Button from "../ui/Button";
import { useCartContext } from "@/app/contexts/CartContext";
import AddToCart from "./AddToCart";
import UpdateItemQuantity from "./UpdateItemQuantity";

export interface CartActionsProps {
  product: ProductWithVariant;
}

export default function CartActions({ product }: CartActionsProps) {
  const { getCartStatus } = useCartContext();
  const isInCart = getCartStatus(product.sku);

  return (
    <div className="flex flex-col gap-2">
      {isInCart ? (
        <UpdateItemQuantity product={product} />
      ) : (
        <AddToCart product={product} />
      )}
      <Button type="primary" beforeBackground="before:bg-amber-100">
        Buy now
      </Button>
    </div>
  );
}
