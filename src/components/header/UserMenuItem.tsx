import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type UserMenuItemProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

export default function UserMenuItem<C extends ElementType>({
  as,
  children,
  ...props
}: UserMenuItemProps<C>) {
  const MenuItem = as || "a";
  return (
    <MenuItem
      className="block w-full px-4 py-2 text-sm text-zinc-800 focus:outline-none focus:bg-amber-200 hover:bg-amber-200 transition-colors duration-200 ease-out"
      role="menuitem"
      {...props}
    >
      <p className="flex items-center gap-3 [&>*:nth-child(1)]:w-5 [&>*:nth-child(1)]:h-5">
        {children}
      </p>
    </MenuItem>
  );
}
