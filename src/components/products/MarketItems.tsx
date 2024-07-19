import { getMarketItems } from "@/db/queries/market";
import ProductRow from "./ProductRow";
import { GiCardboardBox } from "react-icons/gi";
import Product from "./Product";

export default async function MarketItems() {
  const { marketItems } = await getMarketItems({});

  return (
    <div className="mt-8">
      <ProductRow sectionClasses="bg-white" gridSize="large">
        {!marketItems.length && (
          <div className="flex justify-center col-span-3 gap-4 flex-col items-center">
            <GiCardboardBox className="text-zinc-300 h-24 w-24" />
            <p className="text-lg">
              No products were found for these requirements
            </p>
          </div>
        )}
        {marketItems.map((item) => (
          <Product key={item._id} product={item} />
        ))}
      </ProductRow>
    </div>
  );
}
