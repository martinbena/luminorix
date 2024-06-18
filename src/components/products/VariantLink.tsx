import paths from "@/lib/paths";
import Link from "next/link";

interface VariantLinkProps {
  slug: string;
  sku: string;
  selectedCriterion: string | undefined;
  criterionOption: string;
  hasDescription: boolean;
  hexColor?:
    | {
        name: string;
        hex: string;
      }
    | undefined;
}

export default function VariantLink({
  slug,
  sku,
  selectedCriterion,
  criterionOption,
  hasDescription = false,
  hexColor,
}: VariantLinkProps) {
  return (
    <div className="flex flex-col justify-center gap-2.5">
      <Link
        style={{ backgroundColor: hexColor ? hexColor?.hex : "#fff" }}
        aria-disabled={selectedCriterion === criterionOption}
        tabIndex={selectedCriterion === criterionOption ? -1 : undefined}
        className={`w-8 h-8 rounded-full ring-2 ring-offset-4 ring-offset-white ${
          selectedCriterion === criterionOption
            ? "ring-zinc-400 pointer-events-none"
            : "ring-zinc-200"
        } hover:ring-zinc-400 flex justify-center items-center transition-colors duration-300 ease-out outline-none focus:ring-zinc-400`}
        href={paths.productShow(slug, sku)}
      >
        {hasDescription ? (
          <span>&nbsp;</span>
        ) : (
          <span className="font-medium">{criterionOption}</span>
        )}
      </Link>
      {hasDescription ? (
        <p className="capitalize text-zinc-600">{criterionOption}</p>
      ) : null}
    </div>
  );
}
