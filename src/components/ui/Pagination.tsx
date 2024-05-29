"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { PAGE_LIMIT } from "@/lib/constants";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
}

export default function Pagination({
  currentPage,
  totalCount,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (totalPages <= 1) return null;

  return (
    <div className="w-full flex items-center justify-between">
      <p className="ml-2 child:font-semibold">
        Showing <span>{(currentPage - 1) * PAGE_LIMIT + 1}</span> to{" "}
        <span>
          {currentPage === totalPages ? totalCount : currentPage * PAGE_LIMIT}
        </span>{" "}
        of <span>{totalCount}</span> results
      </p>

      <div className="flex gap-1.5">
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <HiChevronLeft className="pr-1" />
          Previous
        </PaginationButton>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationButton
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            activeClasses={currentPage === index + 1 ? "active" : ""}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </PaginationButton>
        ))}
        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <HiChevronRight className="pl-1" />
        </PaginationButton>
      </div>
    </div>
  );
}

interface PaginationButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  activeClasses?: string;
}

function PaginationButton({
  children,
  onClick,
  disabled,
  activeClasses,
}: PaginationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`[&>svg]:h-[18px] [&>svg]:w-[18px] rounded-xl border-none font-medium flex items-center justify-center gap-1 px-1.5 py-3 transition-all duration-300 ${activeClasses} ${
        disabled ? "cursor-not-allowed opacity-75" : "hover:bg-amber-300"
      }`}
    >
      {children}
    </button>
  );
}
