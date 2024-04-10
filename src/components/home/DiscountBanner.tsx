import paths from "@/paths";
import Button from "../Button";
import HeadingTertiary from "../HeadingTertiary";

export default function DiscountBanner() {
  return (
    <div className="grid grid-cols-[2fr_3fr] h-60">
      <div className="bg-amber-50 py-8 px-16 flex flex-col justify-between">
        <div>
          <HeadingTertiary>Limited offer</HeadingTertiary>
          <p className="tracking-[0.2em] font-medium text-xl mt-6">
            10% discount on all jewellery
          </p>
        </div>
        <Button
          href={paths.productShowAll()}
          type="tertiary"
          ariaLabel="Go to the page with all jewellery"
        >
          View all
        </Button>
      </div>
      <div
        role="img"
        aria-label="Jewellery from our sortiment"
        className="bg-discount-banner bg-cover bg-center"
      />
    </div>
  );
}
