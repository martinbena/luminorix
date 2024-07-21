import mongoose, { model, models, Schema } from "mongoose";
import { MarketItem } from "./MarketItem";
import { User } from "./User";

export interface Message extends Document {
  _id: mongoose.Types.ObjectId;
  sender: User;
  recipient: mongoose.Types.ObjectId;
  marketItem: MarketItem;
  phone?: string;
  text: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema<Message>(
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
    text: {
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

const Message = models?.Message || model<Message>("Message", MessageSchema);

export default Message;
