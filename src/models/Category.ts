import mongoose, { Document, Model } from "mongoose";

export interface Category extends Document {
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
      maxLength: 30,
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

const CategoryModel: Model<Category> =
  mongoose.models.Category ||
  mongoose.model<Category>("Category", categorySchema);

export default CategoryModel;
