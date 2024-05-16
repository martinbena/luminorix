"use server";

import Product, {
  Product as ProductType,
  ProductWithVariant,
  Variant,
} from "@/models/Product";
import ConnectDB from "../connectDB";

export async function getAllProducts(): Promise<ProductType[]> {
  await ConnectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(products));
}

export async function getAllProductsWithVariants(): Promise<
  ProductWithVariant[]
> {
  await ConnectDB();
  const products = await Product.find({});

  const allVariants: ProductWithVariant[] = [];
  products.forEach((product) => {
    product.variants.forEach((variant: Variant) => {
      const prod = { ...product.toObject() };
      const { variants: _, ...rest } = prod;
      allVariants.push({
        ...rest,
        _variantId: variant._id,
        sku: variant.sku,
        price: variant.price,
        previousPrice: variant.previousPrice,
        color: variant.color,
        size: variant.size,
        stock: variant.stock,
        sold: variant.sold,
        image: variant.image,
      });
    });
  });

  return JSON.parse(JSON.stringify(allVariants));
}
