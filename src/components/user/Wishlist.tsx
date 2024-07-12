import { auth } from "@/auth";
import { getAllWishlistedItems } from "@/db/queries/wishlist";
import WishlistItems from "./WishlistItems";
import EmptyItemList from "../admin/EmptyItemList";

export default async function Wishlist() {
  const session = await auth();
  const { wishlist, count } = await getAllWishlistedItems(session?.user._id);

  return (
    <>
      {wishlist.length > 0 ? (
        <ul className="border border-zinc-300 rounded-md">
          <WishlistItems
            wishlist={JSON.parse(JSON.stringify(wishlist))}
            count={count}
          />
        </ul>
      ) : (
        <EmptyItemList message="Your wishlist is empty" />
      )}
    </>
  );
}
