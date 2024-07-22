"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { MessagesProvider } from "./contexts/MessagesContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <WishlistProvider>
        <MessagesProvider>
          <CartProvider>{children}</CartProvider>
        </MessagesProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}
