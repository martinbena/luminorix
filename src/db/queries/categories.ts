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

export async function getCategoryBySlug(
  slug: string | undefined
): Promise<{ title: string } | null> {
  try {
    await ConnectDB();

    const category = await Category.findOne({ slug }, { title: 1, _id: 0 });

    return category ? JSON.parse(JSON.stringify(category)) : null;
  } catch (error) {
    throw new Error("Could not get the category by slug");
  }
}
