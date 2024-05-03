import mongoose, { Document } from "mongoose";

interface Category extends Document {
  title: string;
  slug: string;
}

const categorySchema = new mongoose.Schema<Category>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Category ||
  mongoose.model<Category>("Category", categorySchema);
