import { CartProductProps } from "@/app/contexts/CartContext";
import mongoose from "mongoose";
import Product from "./Product";
import User from "./User";

interface CartItemSchema extends CartProductProps {
  quantity: number;
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
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
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
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    delivery_telephone: String,
    delivery_email: String,
    cartItems: [cartItemSchema],
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

export default mongoose.models?.Order || mongoose.model("Order", orderSchema);

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
