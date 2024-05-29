import Product from "@/components/products/Product";
import ProductRow from "@/components/products/ProductRow";
import { getAllProductsWithVariants } from "@/db/queries/products";

export default async function AllProductsPage() {
  const { products } = await getAllProductsWithVariants();

  return (
    <ProductRow title="All products" sectionClasses="bg-white" gridSize="large">
      {products.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </ProductRow>
  );
}
