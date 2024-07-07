import { Order } from "@/models/Order";
import { format } from "date-fns";
import Link from "next/link";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const {
    delivery_status: deliveryStatus,
    status,
    shipping,
    receipt_url: receiptUrl,
    delivery_email: email,
    delivery_telephone: telephone,
    createdAt,
  } = order;
  const { city, country, line1, line2, state, postal_code } = shipping.address;
  const formattedDate = format(new Date(createdAt), "MMM d, yyyy h:mm a");

  return (
    <div className="flex flex-col mb-10 gap-4 child:p-4 child:border child:border-zinc-200 child:bg-zinc-50 child:grid child:grid-cols-[150px_1fr] mob:child:grid-cols-[70px_1fr] child:break-words child:gap-2 [&>*:nth-child(odd)]:child:font-serif [&>*:nth-child(odd)]:child:text-zinc-600 mob-sm:text-xs">
      <div>
        <p>Created:</p>
        <p>{formattedDate}</p>

        <p>Status:</p>
        <p className="font-semibold">{deliveryStatus}</p>
      </div>

      <div>
        <p>Payment:</p>
        <p className="font-semibold">Online card payment</p>

        <p>Status:</p>
        <div className="flex flex-col gap-1">
          <p
            className={`capitalize ${
              status === "succeeded" ? "text-green-700 font-semibold" : ""
            }`}
          >
            {status}
          </p>
          {status === "succeeded" && (
            <p>Order was successfully paid. Thank you.</p>
          )}
        </div>
        {status === "succeeded" && <p>Receipt:</p>}
        {status === "succeeded" && (
          <p>
            {" "}
            <Link
              target="_blank"
              referrerPolicy="no-referrer"
              className="group"
              href={receiptUrl}
            >
              💳{" "}
              <span className="text-amber-700 group-hover:underline">
                View receipt
              </span>
            </Link>
          </p>
        )}
      </div>

      <div>
        <p>Delivery:</p>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{shipping.name}</p>
          <p>{line1}</p>
          {line2 && <p>{line2}</p>}
          <p>{city}</p>
          {state && <p>{state}</p>}
          <p>{postal_code}</p>
          <p>{country}</p>
        </div>
        <p>E-mail:</p>
        <p>{email}</p>
        <p>Telephone:</p>
        <p>{telephone}</p>
      </div>
    </div>
  );
}
