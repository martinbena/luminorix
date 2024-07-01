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
