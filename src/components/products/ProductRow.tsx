import { Children, ReactNode } from "react";
import HeadingSecondary from "../ui/HeadingSecondary";
import Button from "../ui/Button";
import SortBy from "../ui/SortBy";
import { userProductSortOptions } from "@/db/queries/queryOptions";
import FilterTags from "../filters/FilterTags";

interface ProductRowProps {
  sectionClasses?: string;
  title?: string;
  children: ReactNode;
  sort?: boolean;
  filterTags?: boolean;
  hasLink?: boolean;
  linkTo?: string;
  gridSize?: string;
}

export default function ProductRow({
  sectionClasses = "py-10 bg-zinc-100",
  title,
  children,
  sort = false,
  filterTags = false,
  hasLink = false,
  linkTo,
  gridSize = "small",
}: ProductRowProps) {
  return (
    <section className={`px-8 mob:px-5 ${sectionClasses}`}>
      {title && <HeadingSecondary>{title}</HeadingSecondary>}
      {(sort || filterTags) && (
        <div className="my-6 flex justify-between gap-4 mob-lg:flex-col">
          <div>{filterTags ? <FilterTags /> : null}</div>
          <div className="justify-self-end">
            <SortBy options={userProductSortOptions} />
          </div>
        </div>
      )}
      <div
        className={`mt-8 grid gap-8 dt-sm:gap-4 max-w-8xl mx-auto ${
          gridSize === "small"
            ? "grid-cols-[repeat(auto-fit,_minmax(14.75rem,_1fr))]"
            : "grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] dt:grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))] mob:grid-cols-1"
        }`}
      >
        {children}
        {Children.count(children) < 4 && (
          <>
            <span>&nbsp;</span>{" "}
          </>
        )}
        {Children.count(children) < 3 && (
          <>
            <span>&nbsp;</span>{" "}
          </>
        )}
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
