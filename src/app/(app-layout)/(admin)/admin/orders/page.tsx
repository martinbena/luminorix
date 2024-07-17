import AdminActions from "@/components/admin/AdminActions";
import OrderDeliveryStatus from "@/components/admin/OrderDeliveryStatus";
import OrderFilters from "@/components/admin/OrderFilters";
import {
  ItemTitle,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/data-tables/Table";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import Pagination from "@/components/ui/Pagination";
import { getOrders } from "@/db/queries/orders";
import { formatCurrency } from "@/lib/helpers";
import { Order } from "@/models/Order";
import { format } from "date-fns";
import { Metadata } from "next";
import { ReadonlyURLSearchParams } from "next/navigation";
import * as actions from "@/actions";
import EditOrderForm from "@/components/admin/EditOrderForm";

export const metadata: Metadata = {
  title: "Orders",
};

interface AdminOrdersPageProps {
  searchParams: ReadonlyURLSearchParams & { page: string };
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { orders, statusCounts } = await getOrders(searchParams);
  const currentPage = +searchParams?.page || 1;

  const tableColumns =
    "grid-cols-[0.6fr_1fr_2.4fr_1.4fr_1fr_0.4fr] mob-lg:grid-cols-[0.6fr_1fr_2.4fr_1.4fr_0.4fr] mob:grid-cols-[0.6fr_1fr_2.4fr_0.4fr] mob-sm:grid-cols-[0.6fr_1fr_0.4fr]";

  return (
    <section className="max-w-5xl mx-auto">
      <HeadingSecondary>Manage orders</HeadingSecondary>

      <div className="mt-12 py-8 flex flex-col gap-16">
        <OrderFilters filterField="deliveryStatus" options={statusCounts} />
        <div>
          <TableContainer>
            <Table maxWidth="max-w-5xl w-full">
              <TableHeader numColumns={tableColumns}>
                <span>No.</span>
                <span>Date</span>
                <span className="mob-sm:hidden">Recipient</span>
                <span className="mob:hidden">Status</span>
                <span className="mob-lg:hidden">Amount</span>
              </TableHeader>
              <TableBody
                data={orders}
                render={(order: Order) => {
                  const {
                    _id,
                    delivery_status: deliveryStatus,
                    amount_captured: totalPrice,
                    shipping,
                    createdAt,
                    delivery_email: email,
                  } = order;
                  const id = _id.toString();
                  const orderDate = format(new Date(createdAt), "MM/dd/yyyy");
                  return (
                    <TableRow numColumns={tableColumns} key={id}>
                      <ItemTitle>{id.slice(-5)}</ItemTitle>
                      <p className="font-medium">{orderDate}</p>
                      <div className="flex flex-col gap-1 mob-sm:hidden">
                        <p className="font-semibold">{shipping.name}</p>
                        <p className="text-xs font-medium">
                          <a
                            className="hover:underline"
                            href={`mailto:${email}`}
                          >
                            {email}
                          </a>
                        </p>
                      </div>
                      <div className="mob:hidden">
                        <OrderDeliveryStatus deliveryStatus={deliveryStatus} />
                      </div>
                      <p className="font-semibold mob-lg:hidden">
                        {formatCurrency(totalPrice / 100)}
                      </p>
                      <AdminActions<Order>
                        item={JSON.parse(JSON.stringify(order))}
                        onDelete={actions.cancelOrder.bind(null, id)}
                        editForm={
                          <EditOrderForm
                            order={JSON.parse(JSON.stringify(order))}
                          />
                        }
                      />
                    </TableRow>
                  );
                }}
              />
              <TableFooter>
                <Pagination
                  currentPage={currentPage}
                  totalCount={orders.length}
                />
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </div>
    </section>
  );
}
