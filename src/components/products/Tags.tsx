import { ProductWithVariant } from "@/models/Product";

export default function Tags({
  previousPrice,
  price,
  freeShipping,
}: Partial<ProductWithVariant>) {
  return (
    <>
      {(previousPrice && price && previousPrice > price) || freeShipping ? (
        <div className="flex gap-2 child:py-1 child:px-2 font-sans mb-2">
          {previousPrice && price && previousPrice > price ? (
            <div className="bg-amber-300">
              - {Math.round(((previousPrice - price) / previousPrice) * 100)}%
            </div>
          ) : null}
          {freeShipping ? (
            <div className="bg-green-300">Free shipping</div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
