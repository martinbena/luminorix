import { ReactNode } from "react";
import HeadingSecondary from "../ui/HeadingSecondary";
import Button from "../ui/Button";

interface ProductRowProps {
  sectionClasses?: string;
  title: string;
  children: ReactNode;
  hasLink?: boolean;
  linkTo?: string;
  gridSize?: string;
}

export default function ProductRow({
  sectionClasses = "py-10 bg-zinc-100",
  title,
  children,
  hasLink = false,
  linkTo,
  gridSize = "small",
}: ProductRowProps) {
  return (
    <section className={`px-8 mob:px-5 ${sectionClasses}`}>
      <HeadingSecondary>{title}</HeadingSecondary>
      <div
        className={`mt-8 grid gap-8 dt-sm:gap-4 max-w-8xl mx-auto ${
          gridSize === "small"
            ? "grid-cols-[repeat(auto-fit,_minmax(14rem,_1fr))] dt-sm:grid-cols-[repeat(auto-fit,_minmax(12rem,_1fr))]"
            : "grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] dt:grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))] mob:grid-cols-1"
        }`}
      >
        {children}
      </div>

      {hasLink && (
        <div className="mt-8 child:w-96 flex justify-center">
          <Button href={linkTo} type="tertiary">
            View all
          </Button>
        </div>
      )}
    </section>
  );
}
