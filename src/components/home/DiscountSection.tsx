import DiscountBanner from "./DiscountBanner";
import DiscountCoupon from "./DiscountCoupon";

export default function DiscountSection() {
  return (
    <section className="flex flex-col gap-6 px-8 mob:px-5">
      <DiscountBanner />
      <DiscountCoupon />
    </section>
  );
}
