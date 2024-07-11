import { CartItemSchema, Order } from "@/models/Order";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "../data-tables/Table";
import paths from "@/lib/paths";
import CancelOrder from "./CancelOrder";
import * as actions from "@/actions";
import { formatCurrency } from "@/lib/helpers";
import Link from "next/link";
import UserOrderItem from "./UserOrderItem";
import OrderDeliveryStatus from "../admin/OrderDeliveryStatus";

interface UserOrderItemsProps {
  orders: Order[];
}

export default function UserOrderItems({ orders }: UserOrderItemsProps) {
  return (
    <div className="flex flex-col gap-6 mt-16 child:w-full">
      {orders.map((order: Order) => {
        const {
          _id: id,
          createdAt,
          amount_captured: totalPrice,
          success_token: successToken,
          receipt_url: receiptUrl,
          delivery_status: deliveryStatus,
          cartItems,
        } = order;
        const orderDate = format(new Date(createdAt), "MM/dd/yyyy");

        return (
          <TableContainer key={id.toString()}>
            <Table maxWidth="max-w-5xl">
              <TableHeader numColumns="grid-cols-[1fr_max-content] mob-lg:grid-cols-[1fr_max-content]">
                <Headline orderDate={orderDate} totalPrice={totalPrice} />
                <SummaryLinks
                  receiptUrl={receiptUrl}
                  successToken={successToken}
                />
              </TableHeader>
              <SummaryLinks
                receiptUrl={receiptUrl}
                successToken={successToken}
                isSoleRow
              />
              <TableBody
                data={cartItems}
                render={(item: CartItemSchema) => (
                  <TableRow
                    numColumns="grid-cols-[4rem_1fr] mob-sm:grid-cols-[2rem_1fr]"
                    key={item.sku}
                  >
                    <UserOrderItem orderItem={item} />
                  </TableRow>
                )}
              />

              <TableFooter>
                <OrderStatus
                  deliveryStatus={deliveryStatus}
                  id={id.toString()}
                />
              </TableFooter>
            </Table>
          </TableContainer>
        );
      })}
    </div>
  );
}

interface HeadlineProps {
  orderDate: string;
  totalPrice: number;
}

function Headline({ orderDate, totalPrice }: HeadlineProps) {
  return (
    <div>
      <span className="text-base">{orderDate}</span>{" "}
      <span className="lowercase font-normal px-1">for</span>{" "}
      <span className="text-base">{formatCurrency(totalPrice / 100)}</span>
    </div>
  );
}

interface SummaryLinksProps {
  successToken: string;
  receiptUrl: string;
  isSoleRow?: boolean;
}

function SummaryLinks({
  successToken,
  receiptUrl,
  isSoleRow = false,
}: SummaryLinksProps) {
  return (
    <div
      className={`capitalize font-normal gap-2 justify-self-end  ${
        isSoleRow ? "mob:flex hidden px-6 py-1 bg-amber-50" : "flex mob:hidden"
      }`}
    >
      <Link className="hover:underline" href={paths.orderSuccess(successToken)}>
        Summary
      </Link>
      <Link
        target="blank"
        referrerPolicy="no-referrer"
        className="group pl-2 border-l border-zinc-400"
        href={receiptUrl}
      >
        💳 <span className="group-hover:underline">Receipt</span>
      </Link>
    </div>
  );
}

interface OrderStatusProps {
  deliveryStatus: string;
  id: string;
}

function OrderStatus({ deliveryStatus, id }: OrderStatusProps) {
  return (
    <div className="flex w-full justify-between items-center px-3.5 mob-sm:flex-col mob-sm:gap-2">
      <div className="flex items-center gap-2">
        <p className="font-medium">Status:</p>{" "}
        <OrderDeliveryStatus deliveryStatus={deliveryStatus} />
      </div>
      {deliveryStatus === "Not Processed" && (
        <div className="text-center">
          <CancelOrder
            id={id.toString()}
            onCancel={actions.cancelOrder.bind(null, id)}
          />
        </div>
      )}
    </div>
  );
}
