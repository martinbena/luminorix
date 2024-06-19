import ConnectDB from "@/db/connectDB";
import User from "@/models/User";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface GetRequestParams {
  params: { userId: ObjectId };
}

export async function GET(req: NextRequest, urlParams: GetRequestParams) {
  try {
    await ConnectDB();

    const userId = urlParams.params.userId;
    const user = await User.findById(userId).select("wishlist");
    if (!user) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    const wishlistCount: number = user.wishlist.length;

    return NextResponse.json({ count: wishlistCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not get product filters" },
      { status: 500 }
    );
  }
}
