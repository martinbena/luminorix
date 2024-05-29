import Product from "@/components/products/Product";
import ProductRow from "@/components/products/ProductRow";
import { getProductsWithFreeShipping } from "@/db/queries/products";

export default async function FreeShippingPage() {
  const allFreeShipping = await getProductsWithFreeShipping();
  return (
    <>
      <ProductRow
        title="Free shipping"
        sectionClasses="bg-white"
        gridSize="large"
      >
        {allFreeShipping.map((product) => (
          <Product key={product.sku} product={product} />
        ))}
      </ProductRow>
    </>
  );
}
