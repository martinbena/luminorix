"use client";

import { Order } from "@/models/Order";
import OrderDeliveryStatus from "./OrderDeliveryStatus";
import DashboardOrderEdit from "./DashboardOrderEdit";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import EmptyItemList from "./EmptyItemList";
import DashboardList from "./DashboardList";

interface OrdersToProcessProps {
  notProcessedOrders: Order[];
}

export default function OrdersToProcess({
  notProcessedOrders,
}: OrdersToProcessProps) {
  const orderCount = notProcessedOrders.length;

  const prevOrderCountRef = useRef(orderCount);

  useEffect(() => {
    if (prevOrderCountRef.current > orderCount) {
      toast.success("Order successfully processed");
    }
    prevOrderCountRef.current = orderCount;
  }, [orderCount]);

  if (!notProcessedOrders.length)
    return <EmptyItemList message="There are no pending orders right now" />;

  return (
    <DashboardList>
      {notProcessedOrders.slice(0, 5).map((order) => (
        <li
          className="grid grid-cols-[0.5fr_1fr_1fr_max-content] dt:grid-cols-[0.25fr_1fr_max-content] mob:grid-cols-[0.25fr_1fr_max-content] tab-xl:grid-cols-[0.25fr_0.8fr_1fr_max-content] items-center gap-2 py-2"
          key={order._id.toString()}
        >
          <p className="font-semibold">{order._id.toString().slice(-5)}</p>
          <div className="flex flex-col gap-1.5">
            <p className="font-semibold">{order.shipping.name}</p>
            <p className="mob-sm:hidden">{order.delivery_email}</p>
          </div>
          <div className="justify-self-center dt:hidden tab-xl:block mob:hidden">
            <OrderDeliveryStatus deliveryStatus={order.delivery_status} />
          </div>
          <DashboardOrderEdit order={JSON.parse(JSON.stringify(order))} />
        </li>
      ))}
    </DashboardList>
  );
}
