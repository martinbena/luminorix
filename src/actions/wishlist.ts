"use server";

import { validateUserSession } from "@/auth";
import { getProductVariantsBySkus } from "@/db/queries/product";
import { handleDataMutation } from "@/lib/handleDataMutation";
import paths from "@/lib/paths";
import User, { WishlistItem } from "@/models/User";
import { revalidatePath } from "next/cache";

export async function toggleWishlistProduct(slug: string, sku: string) {
  const {
    authenticated,
    authError,
    user: sessionUser,
  } = await validateUserSession();

  if (!authenticated) {
    return {
      errors: {
        _form: [authError],
      },
    };
  }

  const mutationResult = await handleDataMutation(
    async () => {
      const [product] = await getProductVariantsBySkus(sku);
      if (!product) return;

      const user = await User.findById(sessionUser?._id).exec();

      if (!user) throw new Error("User not found");

      const existingWishlistItemIndex: number = user.wishlist.findIndex(
        (item: WishlistItem) => item.sku === sku
      );

      const {
        title,
        price,
        image,
        color,
        size,
        stock,
        brand,
        freeShipping,
        category,
      } = product;

      const wishlistItem = {
        sku,
        product: product._id,
        category,
        title,
        brand,
        freeShipping,
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
    },
    "Something went wrong",
    false
  );

  revalidatePath(paths.userWishlist());
  revalidatePath(paths.userProfile());
  revalidatePath(paths.productShow(slug, sku));

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}
