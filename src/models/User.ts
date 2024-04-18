import mongoose, { Document, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface WishlistItem extends Document {
  product: Types.ObjectId;
  title: string;
  slug: string;
  price: number;
  image: string;
}

const wishlistItemSchema = new mongoose.Schema<WishlistItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    title: String,
    slug: String,
    price: Number,
    image: String,
  },
  { timestamps: true }
);

interface User extends Document {
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

userSchema.plugin(uniqueValidator);

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
