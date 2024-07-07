import ClearCart from "@/components/cart/ClearCart";
import OrderDetails from "@/components/orders/OrderDetails";
import OrderSummary from "@/components/orders/OrderSummary";
import { getAllSuccessTokens } from "@/db/queries/orders";
import { formatCurrency } from "@/lib/helpers";
import paths from "@/lib/paths";
import Order, { Order as OrderType } from "@/models/Order";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaHouseChimney } from "react-icons/fa6";

export async function generateStaticParams() {
  const successTokens = await getAllSuccessTokens();
  return successTokens;
}

export default async function OrderSuccessPage({
  params,
}: {
  params: { successToken: string };
}) {
  const { successToken } = params;
  const order: OrderType | null = await Order.findOne({
    success_token: successToken,
  });

  if (!order) notFound();

  const { _id: id, amount_captured: totalPrice, cartItems } = order;

  return (
    <section className="max-w-5xl mx-auto font-sans">
      <Navigation />
      <Headings id={id.toString()} />
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
