import { formatLargeCurrency } from "@/lib/helpers";
import {
  PiChartBar,
  PiClockCountdown,
  PiHeart,
  PiMoney,
  PiShoppingCartSimple,
  PiStar,
} from "react-icons/pi";
import DashboardStat from "./DashboardStat";

interface CommonStatsProps {
  orderCount: number;
  totalSpent: number;
}

interface UserStatsProps extends CommonStatsProps {
  wishlistCount: number;
  reviewCount: number;
  mode: "user";
}

interface AdminStatsProps extends CommonStatsProps {
  notProcessed: number;
  inventoryRate: number;
  mode: "admin";
}

type DashboardStatsProps = UserStatsProps | AdminStatsProps;

export default function DashboardStats(props: DashboardStatsProps) {
  const { orderCount, totalSpent, mode } = props;
  return (
    <div className="grid grid-cols-4 gap-4 tab-xl:grid-cols-2 mob:grid-cols-1">
      <DashboardStat
        title="Orders"
        color="bg-sky-100"
        iconColor="child:text-sky-700"
        icon={<PiShoppingCartSimple />}
        value={orderCount}
      />
      <DashboardStat
        title={`${mode === "user" ? "Spent" : "Sales"}`}
        color="bg-green-100"
        iconColor="child:text-green-700"
        icon={<PiMoney />}
        value={formatLargeCurrency(totalSpent)}
      />

      {mode === "user" && (
        <>
          <DashboardStat
            title="Wishlisted"
            color="bg-red-100"
            iconColor="child:text-red-700"
            icon={<PiHeart />}
            value={props.wishlistCount}
          />
          <DashboardStat
            title="Reviews"
            color="bg-amber-100"
            iconColor="child:text-amber-700"
            icon={<PiStar />}
            value={props.reviewCount}
          />
        </>
      )}

      {mode === "admin" && (
        <>
          <DashboardStat
            title="Not processed"
            color="bg-purple-100"
            iconColor="child:text-purple-700"
            icon={<PiClockCountdown />}
            value={props.notProcessed}
          />
          <DashboardStat
            title="Inventory rate"
            color="bg-yellow-100"
            iconColor="child:text-yellow-700"
            icon={<PiChartBar />}
            value={`${props.inventoryRate}%`}
          />
        </>
      )}
    </div>
  );
}
