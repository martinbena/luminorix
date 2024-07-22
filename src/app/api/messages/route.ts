import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import Message from "@/models/Message";
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

    const unreadMessagesCount = await Message.countDocuments({
      recipient: session.user._id,
      read: false,
    });

    return NextResponse.json(JSON.stringify(unreadMessagesCount), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not get product filters" },
      { status: 500 }
    );
  }
}
