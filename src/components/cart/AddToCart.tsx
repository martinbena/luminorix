"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import Button from "../ui/Button";
import { ProductWithVariant } from "@/models/Product";
import { WishlistItem } from "@/models/User";

interface AddToCartProps {
  product: ProductWithVariant | WishlistItem;
}

export default function AddToCart({ product }: AddToCartProps) {
  const { addItem } = useCartContext();
  return (
    <Button type="secondary" onClick={() => addItem(product)}>
      Add to cart
    </Button>
  );
}
