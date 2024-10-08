import { CartProductProps } from "@/app/contexts/CartContext";
import mongoose from "mongoose";
import Product from "./Product";
import User from "./User";
import { Document } from "mongoose";
import CategoryModel from "./Category";

export interface CartItemSchema extends CartProductProps {
  quantity: number;
  createdAt: Date;
}

const cartItemSchema = new mongoose.Schema<CartItemSchema>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    sku: String,
    title: String,
    color: String,
    size: String,
    slug: String,
    price: Number,
    image: String,
    brand: String,
    stock: Number,
    freeShipping: Boolean,
    quantity: Number,
    category: String,
    createdAt: Date,
  },
  { timestamps: true }
);

interface Address {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postal_code: string;
  state?: string;
}

interface Shipping {
  address: Address;
  name: string;
}

export interface Order extends Document {
  _id: mongoose.Types.ObjectId;
  chargeId: string;
  payment_intent: string;
  receipt_url: string;
  refunded: boolean;
  status: string;
  amount_captured: number;
  currency: string;
  shipping: Shipping;
  userId: mongoose.Types.ObjectId | string;
  delivery_telephone: string;
  delivery_email: string;
  cartItems: CartItemSchema[];
  success_token: string;
  delivery_status:
    | "Not Processed"
    | "Processing"
    | "Dispatched"
    | "Refunded"
    | "Cancelled"
    | "Delivered";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<Order>(
  {
    chargeId: String,
    payment_intent: String,
    receipt_url: String,
    refunded: Boolean,
    status: String,
    amount_captured: Number,
    currency: String,
    shipping: {
      address: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String,
      },
      name: String,
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    delivery_telephone: String,
    delivery_email: String,
    cartItems: [cartItemSchema],
    success_token: String,
    delivery_status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Dispatched",
        "Refunded",
        "Cancelled",
        "Delivered",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Order ||
  mongoose.model<Order>("Order", orderSchema);

export interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images: string[];
      metadata: {
        sku: string;
      };
    };
    unit_amount: number;
  };
  quantity: number;
}

interface CartSession extends Document {
  sessionId: string;
  lineItems: LineItem[];
  createdAt: Date;
}

const LineItemSchema = new mongoose.Schema<LineItem>(
  {
    price_data: {
      currency: { type: String, required: true },
      product_data: {
        name: { type: String, required: true },
        images: [{ type: String, required: true }],
        metadata: {
          sku: { type: String, required: true },
        },
      },
      unit_amount: { type: Number, required: true },
    },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const CartSessionSchema = new mongoose.Schema<CartSession>({
  sessionId: { type: String, required: true, unique: true },
  lineItems: [LineItemSchema],
  createdAt: { type: Date, default: Date.now, expires: "24h" },
});

export const CartSession =
  mongoose.models?.CartSession ||
  mongoose.model<CartSession>("CartSession", CartSessionSchema);
