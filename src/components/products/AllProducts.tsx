import { getProductsWithAllVariants } from "@/db/queries/products";
import ProductRow from "./ProductRow";
import Product from "./Product";
import { AllProductsPageProps } from "@/app/(app-layout)/(shop)/products/page";
import { GiCardboardBox } from "react-icons/gi";

export default async function AllProducts({
  searchParams,
}: AllProductsPageProps) {
  const { products } = await getProductsWithAllVariants({
    searchParams,
  });
  return (
    <ProductRow sectionClasses="bg-white" gridSize="large" sort filterTags>
      {!products.length && (
        <div className="flex justify-center col-span-3 gap-4 flex-col items-center">
          <GiCardboardBox className="text-zinc-300 h-24 w-24" />
          <p className="text-lg">
            No products were found for these requirements
          </p>
        </div>
      )}
      {products.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </ProductRow>
  );
}
