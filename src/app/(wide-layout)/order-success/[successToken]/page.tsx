import ClearCart from "@/components/cart/ClearCart";
import OrderDetails from "@/components/orders/OrderDetails";
import OrderSummary from "@/components/orders/OrderSummary";
import { formatCurrency } from "@/lib/helpers";
import paths from "@/lib/paths";
import Order, { Order as OrderType } from "@/models/Order";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaHouseChimney } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Order Summary",
};

// Ensure that the data will be fetched correctly during the order creation on Vercel's free plan / slow querries
async function fetchOrder(successToken: string) {
  const order = await Order.findOne({ success_token: successToken });

  if (!order) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return await Order.findOne({ success_token: successToken });
  }

  return order;
}

export default async function OrderSuccessPage({
  params,
}: {
  params: { successToken: string };
}) {
  const { successToken } = params;
  const order = await fetchOrder(successToken);

  if (!order) {
    notFound();
  }

  const { _id: id, amount_captured: totalPrice, cartItems } = order;

  return (
    <section className="max-w-5xl mx-auto font-sans">
      <Navigation />
      <Headings id={id.toString().slice(-5)} />
      <OrderDetails order={order} />
      <OrderSummary cartItems={cartItems} />
      <TotalPrice price={totalPrice} />
      <ClearCart token={JSON.parse(JSON.stringify(successToken))} />
    </section>
  );
}

function Headings({ id }: { id: string }) {
  return (
    <div className="font-semibold flex flex-col gap-3 mb-6">
      <h2 className="text-2xl">Order status</h2>
      <h3 className="text-lg">Order no. {id}</h3>
    </div>
  );
}

function Navigation() {
  return (
    <nav className="flex font-sans pt-4 pb-6 items-center">
      <Link href={paths.home()}>
        <FaHouseChimney className="h-5 w-5 text-amber-500 hover:text-amber-600" />
      </Link>
    </nav>
  );
}

function TotalPrice({ price }: { price: number }) {
  return (
    <div className="flex justify-end items-end gap-16 mob-sm:gap-8">
      <p className="text-lg font-medium">Total price:</p>{" "}
      <p className="font-semibold text-2xl">{formatCurrency(price / 100)}</p>
    </div>
  );
}
