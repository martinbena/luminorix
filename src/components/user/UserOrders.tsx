import { UserOrdersPageProps } from "@/app/(app-layout)/(user)/profile/orders/page";
import { auth } from "@/auth";
import { getOrdersByUserId } from "@/db/queries/orders";
import OrderFilters from "../admin/OrderFilters";
import UserOrderItems from "./UserOrderItems";
import { TfiNotepad } from "react-icons/tfi";

export default async function UserOrders({
  searchParams,
}: UserOrdersPageProps) {
  const session = await auth();

  if (!session?.user) return null;

  const { orders, statusCounts } = await getOrdersByUserId(
    session?.user._id,
    searchParams
  );

  return (
    <>
      <OrderFilters filterField="deliveryStatus" options={statusCounts} />
      {orders.length ? (
        <UserOrderItems orders={orders} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 mt-32">
          <TfiNotepad className="text-zinc-300 h-24 w-24" />
          <p className="text-lg">No orders were found</p>
        </div>
      )}
    </>
  );
}
