import { auth } from "@/auth";
import { getAllWishlistedItems } from "@/db/queries/wishlist";
import WishlistItems from "./WishlistItems";

export default async function Wishlist() {
  const session = await auth();
  const { wishlist, count } = await getAllWishlistedItems(session?.user._id);

  return (
    <WishlistItems
      wishlist={JSON.parse(JSON.stringify(wishlist))}
      count={count}
    />
  );
}
