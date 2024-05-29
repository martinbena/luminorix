import Product from "@/components/products/Product";
import ProductRow from "@/components/products/ProductRow";
import { getProductsWithDiscounts } from "@/db/queries/products";

export default async function AllDiscountsPage() {
  const allDiscounts = await getProductsWithDiscounts();
  return (
    <ProductRow
      title="All discounts"
      sectionClasses="bg-white"
      gridSize="large"
    >
      {allDiscounts.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </ProductRow>
  );
}
