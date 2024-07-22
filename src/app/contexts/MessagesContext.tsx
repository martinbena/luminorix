"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface MessagesContextProps {
  unreadMessagesCount: number;
  setUnreadMessagesCount: Dispatch<SetStateAction<number>>;
}

const MessagesContext = createContext({} as MessagesContextProps);

interface MessagesProviderProps {
  children: ReactNode;
}

function MessagesProvider({ children }: MessagesProviderProps) {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  return (
    <MessagesContext.Provider
      value={{ unreadMessagesCount, setUnreadMessagesCount }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

function useMessagesContext() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error(
      "MessagesContext was used outside the MessagesContextProvider"
    );
  }

  return context;
}

export { MessagesProvider, useMessagesContext };
