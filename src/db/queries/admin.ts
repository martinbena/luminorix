import Order, { Order as OrderType } from "@/models/Order";
import Product, { Product as ProductType } from "@/models/Product";
import ConnectDB from "../connectDB";

export interface BestSellingProduct {
  title: string;
  soldTotal: number;
  image: string | null;
}

export interface BestEarningProduct {
  _id: string;
  totalEarnings: number;
  title: string;
  image: string;
}

export interface TopSellingAndEarningProducts {
  bestSellers: BestSellingProduct[];
  bestEarners: BestEarningProduct[];
}

export async function getTopSellingAndEarningProducts(): Promise<TopSellingAndEarningProducts> {
  try {
    await ConnectDB();

    const bestSellingProducts = (await Product.find()
      .sort({ soldTotal: -1 })
      .limit(5)
      .select("title soldTotal variants.image")
      .lean()
      .exec()) as ProductType[];

    const productImageMap: Record<string, string | null> = {};
    const bestSellingProductsWithImage: BestSellingProduct[] =
      bestSellingProducts.map((product) => {
        const image =
          product.variants.length > 0 ? product.variants[0].image : null;
        productImageMap[product._id.toString()] = image;
        return {
          title: product.title,
          soldTotal: product.soldTotal,
          image,
        };
      });

    const bestEarningProducts = (await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems._id",
          totalEarnings: {
            $sum: { $multiply: ["$cartItems.quantity", "$cartItems.price"] },
          },
          title: { $first: "$cartItems.title" },
          image: { $first: "$cartItems.image" },
        },
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 5 },
    ]).exec()) as BestEarningProduct[];

    const bestEarningProductsWithImage = bestEarningProducts.map((product) => ({
      ...product,
      image: productImageMap[product._id.toString()] || product.image,
    }));

    return {
      bestSellers: bestSellingProductsWithImage,
      bestEarners: bestEarningProductsWithImage,
    };
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    throw error;
  }
}

export async function getNotProcessedOrders(): Promise<OrderType[]> {
  try {
    const notProcessedOrders = await Order.find({
      delivery_status: "Not Processed",
    });
    return notProcessedOrders;
  } catch (error) {
    console.error("Error fetching 'Not Processed' orders:", error);
    throw error;
  }
}

export async function getInventoryRate(): Promise<number> {
  try {
    await ConnectDB();

    const result = await Product.aggregate([
      { $unwind: "$variants" },
      {
        $group: {
          _id: null,
          totalVariants: { $sum: 1 },
          stockedVariants: {
            $sum: { $cond: [{ $gt: ["$variants.stock", 0] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          stockRate: {
            $multiply: [
              { $divide: ["$stockedVariants", "$totalVariants"] },
              100,
            ],
          },
        },
      },
    ]);

    return result[0]?.stockRate ?? 0;
  } catch (error) {
    console.error("Error calculating stock rate:", error);
    throw error;
  }
}
