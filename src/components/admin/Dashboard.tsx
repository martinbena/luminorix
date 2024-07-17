import { getOrders } from "@/db/queries/orders";
import HeadingSecondary from "../ui/HeadingSecondary";
import DashboardFeature from "./DashboardFeature";
import DashboardStats from "./DashboardStats";
import OrdersToProcess from "./OrdersToProcess";
import BestSellers from "./BestSellers";
import {
  getNotProcessedOrders,
  getInventoryRate,
  getTopSellingAndEarningProducts,
} from "@/db/queries/admin";
import SalesChart from "./SalesChart";

export default async function Dashboard() {
  const { totalOrdersCount, totalSpent, statusCounts, categoryCounts } =
    await getOrders({});
  const notProcessedCount =
    statusCounts.find((item) => item.status === "Not Processed")?.count ?? 0;
  const inventoryRate = await getInventoryRate();

  const notProcessedOrders = await getNotProcessedOrders();

  const { bestSellers, bestEarners } = await getTopSellingAndEarningProducts();

  return (
    <>
      <HeadingSecondary>Dashboard</HeadingSecondary>
      <DashboardStats
        mode="admin"
        orderCount={totalOrdersCount}
        totalSpent={totalSpent}
        notProcessed={notProcessedCount}
        inventoryRate={inventoryRate}
      />

      <div className="grid grid-cols-2 gap-4 tab-xl:grid-cols-1">
        <DashboardFeature title="Pending orders">
          <OrdersToProcess
            notProcessedOrders={JSON.parse(JSON.stringify(notProcessedOrders))}
          />
        </DashboardFeature>
        <DashboardFeature>
          <BestSellers
            bestSellers={JSON.parse(JSON.stringify(bestSellers))}
            bestEarners={JSON.parse(JSON.stringify(bestEarners))}
          />
        </DashboardFeature>
      </div>
      <DashboardFeature title="Earnings distribution">
        <SalesChart data={categoryCounts} />
      </DashboardFeature>
    </>
  );
}
