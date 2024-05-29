import DiscountSection from "@/components/home/DiscountSection";
import Product from "@/components/products/Product";
import ProductRow from "@/components/products/ProductRow";
import {
  getNewestProductsWithVariants,
  getProductsWithDiscounts,
} from "@/db/queries/products";
import paths from "@/lib/paths";

export default async function Home() {
  const newestProducts = await getNewestProductsWithVariants();
  const topDiscounts = await getProductsWithDiscounts(4);

  return (
    <>
      <DiscountSection />

      <ProductRow
        title="Newest products"
        hasLink={true}
        linkTo={paths.productShowAll()}
        sectionClasses="py-16 bg-white"
        gridSize="large"
      >
        {newestProducts.map((product) => (
          <Product key={product.sku} />
        ))}
      </ProductRow>

      <ProductRow
        title="Top discounts"
        hasLink={true}
        linkTo={paths.discountShowAll()}
      >
        {topDiscounts.map((product) => (
          <Product key={product.sku} />
        ))}
      </ProductRow>
    </>
  );
}
