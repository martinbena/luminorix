import Category, { Category as CategoryType } from "@/models/Category";
import ConnectDB from "../connectDB";

export async function getAllCategories(): Promise<CategoryType[]> {
  try {
    await ConnectDB();
    const categories = await Category.find({}).sort({ createdAt: 1 });

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error("Could not get product categories");
  }
}
