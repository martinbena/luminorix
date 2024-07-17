import mongoose, { Document, Types } from "mongoose";
import { Category } from "./Category";

export interface Newsletter extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  image?: string;
  resetCode?: {
    data: string;
    expiresAt: Date;
  };
}

const newsletterSchema = new mongoose.Schema<Newsletter>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      index: true,
      lowercase: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Newsletter ||
  mongoose.model<Newsletter>("Newsletter", newsletterSchema);
