import { getProductsWithDiscounts } from "@/db/queries/products";
import ProductRow from "./ProductRow";
import paths from "@/lib/paths";
import Product from "./Product";

export default async function TopDiscounts() {
  const topDiscounts = await getProductsWithDiscounts(4);
  return (
    <ProductRow
      title="Top discounts"
      hasLink={true}
      linkTo={paths.discountShowAll()}
    >
      {topDiscounts.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </ProductRow>
  );
}
