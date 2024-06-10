import { getProductsWithAllVariants } from "@/db/queries/products";
import ProductRow from "./ProductRow";
import Product from "./Product";
import { AllProductsPageProps } from "@/app/(app-layout)/(shop)/products/page";

export default async function AllProducts({
  searchParams,
}: AllProductsPageProps) {
  const { products, currentCategory } = await getProductsWithAllVariants({
    searchParams,
  });
  return (
    <ProductRow
      title={currentCategory?.title ?? "All sortiment"}
      sectionClasses="bg-white"
      gridSize="large"
      sort
      filterTags
    >
      {products.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </ProductRow>
  );
}
