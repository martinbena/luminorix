import DiscountBanner from "@/components/home/DiscountBanner";
import DiscountCoupon from "@/components/home/DiscountCoupon";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <DiscountBanner />
        <DiscountCoupon />
      </div>
    </>
  );
}
