import Product, { Product as ProductType } from "@/models/Product";
import ConnectDB from "../connectDB";

export async function getAllProducts(): Promise<ProductType[]> {
  await ConnectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(products));
}
