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

  const priceData = await Product.aggregate([
    { $match: matchStage },
    { $unwind: "$variants" },
    {
      $group: {
        _id: null,
        lowestPrice: { $min: "$variants.price" },
        highestPrice: { $max: "$variants.price" },
      },
    },
  ]);

  const lowestPrice = priceData[0]?.lowestPrice || 0;
  const highestPrice = priceData[0]?.highestPrice || 100000;

  return NextResponse.json(
    {
      brands,
      colors,
      sizes,
      lowestPrice,
      highestPrice,
    },
    { status: 200 }
  );
}
