"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface ForgottenPasswordContextProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  resetCode: string[];
  setResetCode: Dispatch<SetStateAction<string[]>>;
}

const ForgottenPasswordContext = createContext(
  {} as ForgottenPasswordContextProps
);

interface ForgottenPasswordProviderProps {
  children: ReactNode;
}

function ForgottenPasswordProvider({
  children,
}: ForgottenPasswordProviderProps) {
  const [email, setEmail] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resetCode, setResetCode] = useState<string[]>(Array(6).fill(""));

  return (
    <ForgottenPasswordContext.Provider
      value={{
        email,
        setEmail,
        currentStep,
        setCurrentStep,
        resetCode,
        setResetCode,
      }}
    >
      {children}
    </ForgottenPasswordContext.Provider>
  );
}

function useForgottenPasswordContext() {
  const context = useContext(ForgottenPasswordContext);
  if (context === undefined) {
    throw new Error(
      "ForgottenPasswordContext was used outside the ForgottenPasswordContextProvider"
    );
  }

  return context;
}

export { ForgottenPasswordProvider, useForgottenPasswordContext };
