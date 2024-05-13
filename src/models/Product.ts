import mongoose, { Types } from "mongoose";
import { Document } from "mongoose";

interface Rating extends Document {
  rating: number;
  comment: string;
  postedBy: Types.ObjectId;
}

const ratingSchema = new mongoose.Schema<Rating>(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 200,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export interface Product extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  previousPrice: number;
  color?: string;
  size?: string;
  brand: string;
  stock: number;
  freeShipping: boolean;
  category: Types.ObjectId;
  image?: string;
  sold: number;
  ratings: Rating[];
}

const productSchema = new mongoose.Schema<Product>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: 160,
      text: true,
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    previousPrice: Number,
    color: String,
    size: String,
    brand: String,
    stock: Number,
    freeShipping: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      public_id: {
        type: String,
        default: "",
      },
      secure_url: {
        type: String,
        default: "",
      },
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratings: [ratingSchema],
  },
  { timestamps: true }
);

export default mongoose.models?.Product ||
  mongoose.model<Product>("Product", productSchema);
