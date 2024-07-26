import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({
        error: "You must be logged in to see your messages",
        status: 401,
      });
    }

    const user = await User.findById(session.user._id).select("wishlist");
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
