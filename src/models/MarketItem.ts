import mongoose, { Types } from "mongoose";
import { Document } from "mongoose";
import { User } from "./User";
import { Product } from "./Product";

export interface MarketItem extends Document {
  product: Product;
  postedBy: User;
  price: number;
  age: number;
  condition: string;
  location: string;
  issues: string;
  image: string;
  responded: number;
  createdAt: Date;
}

const marketItemSchema = new mongoose.Schema<MarketItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    age: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 2,
    },
    condition: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10,
      text: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
      text: true,
    },
    issues: {
      type: String,
      trim: true,
      maxlength: 2000,
      text: true,
    },
    image: {
      type: String,
      required: true,
    },
    responded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.MarketItem ||
  mongoose.model<MarketItem>("MarketItem", marketItemSchema);
