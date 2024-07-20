import mongoose, { model, models, Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    marketItem: {
      type: Schema.Types.ObjectId,
      ref: "MarketItem",
      required: true,
    },
    phone: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = models?.Message || model("Message", MessageSchema);

export default Message;
