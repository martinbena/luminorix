import mongoose, { Types } from "mongoose";
import { Document } from "mongoose";

export interface Rating extends Document {
  rating: 5 | 4 | 3 | 2 | 1;
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

export interface Variant extends Document {
  sku: string;
  price: number;
  previousPrice: number;
  color?: string;
  size?: string;
  stock: number;
  sold: number;
  image: string;
}

const variantSchema = new mongoose.Schema<Variant>(
  {
    sku: {
      type: String,
      minlength: 3,
      maxlength: 50,
      unique: true,
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
    stock: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export interface Product extends Document {
  title: string;
  slug: string;
  description: string;
  brand: string;
  freeShipping: boolean;
  category: Types.ObjectId;
  soldTotal: number;
  variants: Variant[];
  ratings: Rating[];
}

export interface ProductWithVariant extends Product, Variant {
  averageRating: number;
}

const productSchema = new mongoose.Schema<Product>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 3,
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
      minlength: 50,
      maxlength: 2000,
      text: true,
    },
    brand: String,
    freeShipping: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    soldTotal: {
      type: Number,
      default: 0,
    },
    variants: [variantSchema],
    ratings: [ratingSchema],
  },
  { timestamps: true }
);

export default mongoose.models?.Product ||
  mongoose.model<Product>("Product", productSchema);
