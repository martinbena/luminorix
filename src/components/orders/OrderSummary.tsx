import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import { CartItemSchema } from "@/models/Order";
import Image from "next/image";
import Link from "next/link";

interface OrderSummaryProps {
  cartItems: CartItemSchema[];
}

export default function OrderSummary({ cartItems }: OrderSummaryProps) {
  const tableColumns =
    "grid-cols-[2.2fr_1.5fr_1fr_1fr] mob-lg:grid-cols-[3fr_0.5fr_2.3fr]";
  return (
    <table className="w-full mb-10">
      <thead className="border-b border-zinc-200">
        <tr className={`text-xs pb-3.5 grid ${tableColumns}`}>
          <th className="justify-self-start">Product</th>
          <th className="mob">Quantity</th>
          <th className="mob-lg:hidden">Unit price</th>
          <th className="justify-self-end">Total price</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.map((item) => (
          <tr
            key={item.sku}
            className={`grid ${tableColumns} gap-4 items-center justify-items-center py-3.5 px-2 font-semibold border-b border-zinc-200`}
          >
            <td className="grid grid-cols-[56px_1fr] mob-lg:grid-cols-1 items-center gap-10 tab-xl:gap-4 justify-self-start">
              <div className="relative aspect-square h-14 w-14 mob-lg:hidden">
                <Image
                  src={item.image}
                  fill
                  alt={getProductVariantTitle(
                    item.title,
                    item.color,
                    item.size
                  )}
                  className="object-cover max-w-full"
                />
              </div>
              <Link
                className="font-serif text-base hover:underline text-amber-700 mob:text-sm"
                href={paths.productShow(item.slug, item.sku)}
              >
                {getProductVariantTitle(item.title, item.color, item.size)}
              </Link>
            </td>
            <td className="font-normal">{item.quantity}</td>
            <td className="text-lg mob-lg:hidden">
              {formatCurrency(item.price)}
            </td>
            <td className="text-lg justify-self-end mob:text-sm">
              {formatCurrency(item.quantity * item.price)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
