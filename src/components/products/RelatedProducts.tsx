import { getRelatedProductsBySku } from "@/db/queries/product";
import ProductRow from "./ProductRow";
import { ProductWithVariant } from "@/models/Product";
import Product from "./Product";

interface RelatedProductsProps {
  sku: string;
}

export default async function RelatedProducts({ sku }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProductsBySku(sku);

  return (
    <div className="my-10">
      <ProductRow gridSize="small" title="You might also like">
        {relatedProducts.map((product: ProductWithVariant) => (
          <Product key={product.sku} product={product} />
        ))}
      </ProductRow>
    </div>
  );
}
