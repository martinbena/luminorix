import { getSearchedProducts } from "@/db/queries/search";
import { GiCardboardBox } from "react-icons/gi";
import Product from "./Product";
import ProductRow from "./ProductRow";

interface SearchedProductsProps {
  term: string;
}

export default async function SearchedProducts({
  term,
}: SearchedProductsProps) {
  const { data: products, count } = await getSearchedProducts(term);

  return (
    <div className="mt-12">
      <p className="text-base font-sans text-right px-8">
        {" "}
        <span className="font-semibold">{count}</span> results found
      </p>
      <ProductRow sectionClasses="bg-white" gridSize="large">
        {!products.length && (
          <div className="flex justify-center col-span-3 gap-4 flex-col items-center">
            <GiCardboardBox className="text-zinc-300 h-24 w-24" />
            <p className="text-lg">No products were found for this term</p>
          </div>
        )}
        {products.map((product) => (
          <Product key={product.sku} product={product} />
        ))}
      </ProductRow>
    </div>
  );
}
