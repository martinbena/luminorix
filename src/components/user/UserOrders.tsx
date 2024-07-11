import { UserOrdersPageProps } from "@/app/(app-layout)/(user)/profile/orders/page";
import { auth } from "@/auth";
import { getOrders } from "@/db/queries/orders";
import OrderFilters from "../admin/OrderFilters";
import UserOrderItems from "./UserOrderItems";
import EmptyItemList from "../admin/EmptyItemList";

export default async function UserOrders({
  searchParams,
}: UserOrdersPageProps) {
  const session = await auth();

  if (!session?.user) return null;

  const { orders, statusCounts } = await getOrders(
    searchParams,
    session?.user._id
  );

  return (
    <>
      <OrderFilters filterField="deliveryStatus" options={statusCounts} />
      {orders.length ? (
        <UserOrderItems orders={orders} />
      ) : (
        <div className="mt-32">
          <EmptyItemList message="No orders were found" />
        </div>
      )}
    </>
  );
}
