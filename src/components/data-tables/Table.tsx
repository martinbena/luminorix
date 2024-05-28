import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  maxWidth: string;
}

export function Table({ children, maxWidth }: TableProps) {
  return (
    <div
      role="table"
      className={`rounded-md border border-zinc-200 font-sans mt-16 ${maxWidth} w-full`}
    >
      {children}
    </div>
  );
}

interface TableContainerProps {
  children: ReactNode;
}

export function TableContainer({ children }: TableContainerProps) {
  return <div className="flex justify-center mx-auto">{children}</div>;
}

interface TableHeaderProps {
  children: ReactNode;
  numColumns?: string;
}

export function TableHeader({
  numColumns = "grid-cols-[1fr_max-content]",
  children,
}: TableHeaderProps) {
  return (
    <header
      role="row"
      className={`bg-amber-100 rounded-t-md uppercase font-semibold tracking-wide border-b border-zinc-100 px-6 py-4 grid ${numColumns} gap-x-6 items-center`}
    >
      {children}
    </header>
  );
}

interface ItemTitleProps {
  children: ReactNode;
}

export function ItemTitle({ children }: ItemTitleProps) {
  return <div className="font-semibold tracking-wide">{children}</div>;
}

interface TableBodyProps<T> {
  data: T[];
  render: (item: T) => JSX.Element;
}

export function TableBody<T>({ data, render }: TableBodyProps<T>) {
  if (!data.length)
    return (
      <p className="text-base font-medium text-center m-6">
        No data to show at the moment
      </p>
    );

  return <section className="mt-2">{data.map(render)}</section>;
}

interface TableRowProps {
  children: ReactNode;
  numColumns?: string;
}

export function TableRow({
  numColumns = "grid-cols-[1fr_max-content]",
  children,
}: TableRowProps) {
  return (
    <div
      role="row"
      className={`grid ${numColumns} gap-6 items-center px-6 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100 mob-lg:px-3 mob-lg:py-2 mob-lg:gap-4`}
    >
      {children}
    </div>
  );
}

interface FooterProps {
  children: ReactNode;
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className="p-3 bg-zinc-100 flex justify-center [&:not(:has(*))]:hidden">
      {children}
    </footer>
  );
}
