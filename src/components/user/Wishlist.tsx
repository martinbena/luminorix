import { auth } from "@/auth";
import { getAllWishlistedItems } from "@/db/queries/wishlist";
import WishlistItems from "./WishlistItems";
import { TfiNotepad } from "react-icons/tfi";

export default async function Wishlist() {
  const session = await auth();
  const { wishlist, count } = await getAllWishlistedItems(session?.user._id);

  return (
    <>
      {wishlist.length > 0 ? (
        <ul className="border border-zinc-300 max-w-5xl mx-auto rounded-md">
          <WishlistItems
            wishlist={JSON.parse(JSON.stringify(wishlist))}
            count={count}
          />
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <TfiNotepad className="text-zinc-300 h-24 w-24" />
          <p className="text-lg">Your wishlist is empty</p>
        </div>
      )}
    </>
  );
}
