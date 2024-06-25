import mongoose, { Document, Types } from "mongoose";

export interface WishlistItem extends Document {
  sku: string;
  product: Types.ObjectId;
  title: string;
  brand: string;
  freeShipping: boolean;
  color: string;
  size: string;
  stock: number;
  slug: string;
  price: number;
  image: string;
}

const wishlistItemSchema = new mongoose.Schema<WishlistItem>(
  {
    sku: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    title: String,
    brand: String,
    freeShipping: Boolean,
    color: String,
    size: String,
    stock: Number,
    slug: String,
    price: Number,
    image: String,
  },
  { timestamps: true }
);

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  image?: string;
  resetCode?: {
    data: string;
    expiresAt: Date;
  };
  wishlist: WishlistItem[];
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minLength: 5,
      maxLength: 50,
    },
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
    password: String,
    role: {
      type: String,
      default: "user",
    },
    image: String,
    wishlist: [wishlistItemSchema],
    resetCode: {
      data: String,
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models?.User ||
  mongoose.model<User>("User", userSchema);
