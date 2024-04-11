import DiscountBanner from "@/components/home/DiscountBanner";
import DiscountCoupon from "@/components/home/DiscountCoupon";
import NewestProducts from "@/components/home/NewestProducts";
import TopDiscounts from "@/components/home/TopDiscounts";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-6 px-8">
        <DiscountBanner />
        <DiscountCoupon />
      </div>

      <NewestProducts />
      <TopDiscounts />
    </>
  );
}
