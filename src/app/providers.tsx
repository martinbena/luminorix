"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "./contexts/WishlistContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </SessionProvider>
  );
}
