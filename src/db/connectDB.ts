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

export default async function ConnectDB(): Promise<void> {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.itm23iu.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
    );
    mongoose.modelNames();
  } catch (error: unknown) {
    console.log(error);
  }
}
