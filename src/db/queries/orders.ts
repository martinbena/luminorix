import Order from "@/models/Order";
import ConnectDB from "../connectDB";

export async function getAllSuccessTokens(): Promise<string[]> {
  try {
    await ConnectDB();
    const successTokens = await Order.find()
      .select("success_token -_id")
      .exec();

    const tokensArray = successTokens.map((doc) => doc.success_token);

    return tokensArray;
  } catch (error) {
    console.error("Error fetching success tokens:", error);
    return [];
  }
}
