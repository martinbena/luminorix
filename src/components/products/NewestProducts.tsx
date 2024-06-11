import paths from "@/lib/paths";
import ProductRow from "./ProductRow";
import { getNewestProductsWithVariants } from "@/db/queries/products";
import Product from "./Product";

export default async function NewestProducts() {
  const newestProducts = await getNewestProductsWithVariants();
  return (
    <ProductRow
      title="Newest products"
      hasLink={true}
      linkTo={paths.productShowAll()}
      sectionClasses="py-16 bg-white"
      gridSize="large"
    >
      {newestProducts.map((product) => (
        <Product key={product.sku} product={product} hasDescription={true} />
      ))}
    </ProductRow>
  );
}
