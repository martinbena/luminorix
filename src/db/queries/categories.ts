import Category, { Category as CategoryType } from "@/models/Category";
import ConnectDB from "../connectDB";

export async function getAllCategories(): Promise<CategoryType[]> {
  await ConnectDB();
  const categories = await Category.find({}).sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(categories));
}
