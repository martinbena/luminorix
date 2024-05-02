"use client";

import useCloseOnClickOutside from "@/hooks/useCloseOnClickOutside";
import useKeyboardInteractions from "@/hooks/useKeyboardInteractions";
import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

interface PopoverContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = createContext({} as PopoverContextProps);

interface PopoverProps {
  children: ReactNode;
}

function Popover({ children }: PopoverProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  );
}

interface ButtonProps {
  children: ReactNode;
  screenReaderTitle?: string;
}

function Button({ children, screenReaderTitle }: ButtonProps) {
  const { isOpen, setIsOpen } = useContext(PopoverContext);

  return (
    <button onClick={() => setIsOpen((isOpen) => !isOpen)} tabIndex={-1}>
      <span className="sr-only">{`${
        isOpen ? "Close" : "Open"
      } ${screenReaderTitle}`}</span>
      {children}
    </button>
  );
}

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps) {
  const { isOpen, setIsOpen } = useContext(PopoverContext);
  const popoverContentRef = useRef<HTMLDivElement>(null);

  useCloseOnClickOutside(isOpen, setIsOpen, popoverContentRef);
  useKeyboardInteractions(isOpen, setIsOpen, popoverContentRef);

  if (!isOpen) return null;

  return (
    <div
      className="absolute font-sans flex flex-col gap-2.5 right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-100 py-2 ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      ref={popoverContentRef}
    >
      <div className="triangle" />
      {children}
    </div>
  );
}

type RowProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  icon?: ReactNode;
} & ComponentPropsWithoutRef<T>;

function Row<C extends ElementType>({
  as,
  children,
  icon,
  ...props
}: RowProps<C>) {
  const MenuItem = as || "button";
  const { setIsOpen } = useContext(PopoverContext);

  return (
    <MenuItem
      className="block w-full px-4 py-2 text-sm text-zinc-800 focus:outline-none focus:bg-amber-200 hover:bg-amber-200 transition-colors duration-200 ease-out"
      role="menuitem"
      onClick={() => setIsOpen(false)}
      {...props}
    >
      <p
        className={`${
          icon
            ? "flex items-center gap-3 [&>*:nth-child(1)]:w-5 [&>*:nth-child(1)]:h-5"
            : ""
        } `}
      >
        {icon && icon} <span>{children}</span>
      </p>
    </MenuItem>
  );
}

Popover.Button = Button;
Popover.Content = Content;
Popover.Row = Row;

export default Popover;
