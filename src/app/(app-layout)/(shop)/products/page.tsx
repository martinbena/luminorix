import Product from "@/components/products/Product";
import ProductRow from "@/components/products/ProductRow";
import { getProductsWithAllVariants } from "@/db/queries/products";
import { ReadonlyURLSearchParams } from "next/navigation";

interface AllProductsPageProps {
  searchParams: ReadonlyURLSearchParams;
}

export default async function AllProductsPage({
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
    >
      {products.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </ProductRow>
  );
}
