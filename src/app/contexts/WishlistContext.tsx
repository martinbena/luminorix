"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface WishlistContextProps {
  wishlistCount: number;
  setWishlistCount: Dispatch<SetStateAction<number>>;
}

const WishlistContext = createContext({} as WishlistContextProps);

interface WishlistProviderProps {
  children: ReactNode;
}

function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  return (
    <WishlistContext.Provider value={{ wishlistCount, setWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error(
      "WishlistContext was used outside the WishlistContextProvider"
    );
  }

  return context;
}

export { WishlistProvider, useWishlistContext };
