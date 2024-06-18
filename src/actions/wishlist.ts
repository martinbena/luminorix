"use server";

import { auth } from "@/auth";
import { getProductVariantBySku } from "@/db/queries/product";
import paths from "@/lib/paths";
import User, { WishlistItem } from "@/models/User";
import { revalidatePath } from "next/cache";

export async function toggleWishlistProduct(slug: string, sku: string) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error(
        "Only logged in users can add products into their wishlists"
      );
    }

    const product = await getProductVariantBySku(sku);
    if (!product) return;

    const user = await User.findById(session.user._id).exec();

    if (!user) return;

    const existingWishlistItemIndex: number = user.wishlist.findIndex(
      (item: WishlistItem) => item.sku === sku
    );

    const { title, price, image, color, size, stock } = product;

    const wishlistItem = {
      sku,
      product: product._id,
      title,
      color,
      size,
      stock,
      slug,
      price,
      image,
    };

    if (existingWishlistItemIndex > -1) {
      user.wishlist.splice(existingWishlistItemIndex, 1);
    } else {
      user.wishlist.push(wishlistItem);
    }

    await user.save();

    revalidatePath(paths.userWishlist());
    revalidatePath(paths.productShow(slug, sku));
  } catch (error) {
    throw error;
  }
}
