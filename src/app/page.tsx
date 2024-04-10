import Button from "@/components/Button";
import HeadingSecondary from "@/components/HeadingSecondary";
import DiscountBanner from "@/components/home/DiscountBanner";
import DiscountCoupon from "@/components/home/DiscountCoupon";
import NewestProducts from "@/components/home/NewestProducts";
import Product from "@/components/products/Product";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <DiscountBanner />
        <DiscountCoupon />
      </div>

      <NewestProducts />
    </>
  );
}
