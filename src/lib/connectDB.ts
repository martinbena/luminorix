import mongoose from "mongoose";

interface ProcessEnv {
  MONGODB_USERNAME: string;
  MONGODB_PASSWORD: string;
  MONGODB_CLUSTERNAME: string;
  MONGODB_DATABASE: string;
}

declare const process: {
  env: ProcessEnv;
};

interface ConnectDBResponse {
  status: number;
  message?: string;
}

export default async function ConnectDB(): Promise<ConnectDBResponse> {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState >= 1) {
    return { status: 200, message: "Already connected to the database" };
  }

  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.itm23iu.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
    );
    return { status: 200, message: "Connected to the database successfully" };
  } catch (error: any) {
    return { status: 500, message: "Failed to connect to the database" };
  }
}
