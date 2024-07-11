export default function OrderDeliveryStatus({
  deliveryStatus,
}: {
  deliveryStatus: string;
}) {
  return (
    <p
      className={`px-3 py-1 text-xs font-semibold rounded-full uppercase max-w-max ${
        deliveryStatus === "Not Processed"
          ? "text-orange-700 bg-orange-100"
          : deliveryStatus === "Processing"
          ? "text-sky-700 bg-sky-100"
          : deliveryStatus === "Dispatched"
          ? "text-lime-700 bg-lime-100"
          : deliveryStatus === "Delivered"
          ? "text-green-700 bg-green-100"
          : "text-red-700 bg-red-100"
      }`}
    >
      {deliveryStatus}
    </p>
  );
}
