"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import { useEffect } from "react";

interface ClearCartProps {
  token: string;
}

export default function ClearCart({ token }: ClearCartProps) {
  const { clearCartAndDiscount } = useCartContext();

  useEffect(() => {
    if (typeof token === "string") {
      const clearedTokens = JSON.parse(
        localStorage.getItem("clearedTokens") || "[]"
      );

      if (!clearedTokens.includes(token)) {
        clearCartAndDiscount();
        clearedTokens.push(token);
        localStorage.setItem("clearedTokens", JSON.stringify(clearedTokens));
      }
    }
  }, [token, clearCartAndDiscount]);

  return null;
}
