import { formatLargeCurrency } from "@/lib/helpers";
import { PiHeart, PiMoney, PiShoppingCartSimple, PiStar } from "react-icons/pi";
import ProfileStat from "./ProfileStat";

interface ProfileStatsProps {
  orderCount: number;
  totalSpent: number;
  wishlistCount: number;
  reviewCount: number;
}

export default function ProfileStats({
  orderCount,
  totalSpent,
  wishlistCount,
  reviewCount,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 tab-xl:grid-cols-2 mob:grid-cols-1">
      <ProfileStat
        title="Orders"
        color="bg-sky-100"
        iconColor="child:text-sky-700"
        icon={<PiShoppingCartSimple />}
        value={orderCount}
      />
      <ProfileStat
        title="Spent"
        color="bg-green-100"
        iconColor="child:text-green-700"
        icon={<PiMoney />}
        value={formatLargeCurrency(totalSpent)}
      />
      <ProfileStat
        title="Wishlisted"
        color="bg-red-100"
        iconColor="child:text-red-700"
        icon={<PiHeart />}
        value={wishlistCount}
      />
      <ProfileStat
        title="Reviews"
        color="bg-amber-100"
        iconColor="child:text-amber-700"
        icon={<PiStar />}
        value={reviewCount}
      />
    </div>
  );
}
