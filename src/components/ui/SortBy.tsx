"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SortOption {
  value: string;
  label: string;
}

interface SortByProps {
  options: SortOption[];
}

export default function SortBy({ options }: SortByProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleSortByChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const sortBy = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (sortBy === "") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", sortBy);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currentSortBy = searchParams.get("sortBy") || "";

  return (
    <select
      value={currentSortBy}
      onChange={handleSortByChange}
      className="border border-zinc-200 bg-zinc-50 px-2 py-2.5 rounded-md font-medium focus:border-zinc-400 focus:outline-none"
    >
      <option value="">- Select Sort Option -</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
