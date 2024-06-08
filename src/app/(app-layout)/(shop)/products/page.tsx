import Product from "@/components/products/Product";
import ProductRow from "@/components/products/ProductRow";
import SortBy from "@/components/ui/SortBy";
import { getProductsWithAllVariants } from "@/db/queries/products";
import {
  ProductSearchParams,
  userProductSortOptions,
} from "@/db/queries/queryOptions";

interface AllProductsPageProps {
  searchParams: ProductSearchParams;
}

export default async function AllProductsPage({
  searchParams,
}: AllProductsPageProps) {
  const { products, currentCategory } = await getProductsWithAllVariants({
    searchParams,
  });

  return (
    <>
      <SortBy options={userProductSortOptions} />
      <ProductRow
        title={currentCategory?.title ?? "All sortiment"}
        sectionClasses="bg-white"
        gridSize="large"
      >
        {products.map((product) => (
          <Product key={product.sku} product={product} />
        ))}
      </ProductRow>
    </>
  );
}
