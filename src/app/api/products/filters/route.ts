import ConnectDB from "@/db/connectDB";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDB();

  const categorySlug = req.nextUrl.searchParams.get("categorySlug");

  let matchStage = {};

  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (category) {
      matchStage = { category: category._id };
    }
  }

  const brands = await Product.distinct("brand", matchStage);
  const colors = (await Product.distinct("variants.color", matchStage)).filter(
    (color) => color
  );
  const sizes = (await Product.distinct("variants.size", matchStage)).filter(
    (size) => size
  );

  return NextResponse.json(
    {
      brands,
      colors,
      sizes,
    },
    { status: 200 }
  );
}
