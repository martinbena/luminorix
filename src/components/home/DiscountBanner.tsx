import paths from "@/lib/paths";
import Button from "../Button";
import HeadingTertiary from "../HeadingTertiary";

export default function DiscountBanner() {
  return (
    <div className="grid grid-cols-[2fr_3fr] mob-lg:grid-cols-1 tab-lg:grid-cols-2">
      <div className="bg-amber-50 py-8 px-16 flex flex-col justify-between tab-xl:p-8 mob-lg:order-2">
        <div className="mob-lg:mb-6">
          <HeadingTertiary>Limited offer</HeadingTertiary>
          <p className="tracking-[0.2em] font-medium text-xl tab-xl:text-lg mt-6">
            10% discount on all jewelry
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
        className="bg-discount-banner bg-cover bg-center h-56 mob-lg:order-1"
      />
    </div>
  );
}
