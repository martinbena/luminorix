"use client";

import * as actions from "@/actions";
import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import { WishlistItem } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import RemoveFromWishlist from "./RemoveFromWishlist";
import { useEffect, useOptimistic } from "react";
import { useWishlistContext } from "@/app/contexts/WishlistContext";
import CartActions from "../cart/CartActions";
import { debounce } from "lodash";
import EmptyItemList from "../admin/EmptyItemList";

interface WishlistProps {
  wishlist: WishlistItem[];
  count: number;
}

export default function WishlistItems({ wishlist, count }: WishlistProps) {
  const [optimisticWishlist, optimisticRemoval] = useOptimistic(
    wishlist,
    (prevState: WishlistItem[], sku: string): WishlistItem[] => {
      return prevState.filter((item) => item.sku !== sku);
    }
  );

  const { wishlistCount, setWishlistCount } = useWishlistContext();

  const debouncedUpdateCount = debounce((dbWishlistCount, setWishlistCount) => {
    setWishlistCount(dbWishlistCount);
  }, 10000);

  useEffect(() => {
    if (count !== wishlistCount) {
      debouncedUpdateCount(count, setWishlistCount);
    }

    return () => {
      debouncedUpdateCount.cancel();
    };
  }, [count, wishlistCount, setWishlistCount, debouncedUpdateCount]);

  async function handleRemoveItem(slug: string, sku: string) {
    optimisticRemoval(sku);
    await actions.toggleWishlistProduct(slug, sku);
  }

  if (!optimisticWishlist.length)
    return (
      <div className="mt-20">
        <EmptyItemList message="Your wishlist is empty" />
      </div>
    );

  return (
    <ul className="border border-zinc-300 rounded-md">
      {optimisticWishlist.map((item) => {
        const composedTitle = getProductVariantTitle(
          item.title,
          item.color,
          item.size
        );
        return (
          <li
            key={item.sku}
            className="grid relative grid-cols-[150px_2.5fr_1.5fr] tab-lg:grid-cols-[150px_1fr] mob:grid-cols-1 p-8 mob:px-4 mob:py-6 gap-x-8 gap-y-4 [&:not(:last-child)]:border-b border-zinc-200"
          >
            <Link
              className="relative aspect-square overflow-hidden mob:h-[150px] mob:w-[150px] mob:mx-auto"
              href={paths.productShow(item.slug, item.sku)}
              tabIndex={-1}
            >
              <Image
                src={item.image}
                alt={composedTitle}
                fill
                className="object-cover"
              />
            </Link>

            <div className="font-sans flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif font-semibold mob-lg:text-xl">
                  <Link
                    className="hover:underline focus:outline-none focus:underline"
                    href={paths.productShow(item.slug, item.sku)}
                  >
                    {composedTitle}
                  </Link>
                </h3>
                <p className="mt-2">{item.stock} in stock</p>
              </div>

              <p className="font-semibold text-2xl mt-auto mob-lg:text-xl mob:mt-3">
                {formatCurrency(item.price)}
              </p>
            </div>
            <div className="flex flex-col justify-between tab-lg:col-span-2 mob:col-span-1">
              <div className="mt-auto">
                <CartActions product={JSON.parse(JSON.stringify(item))} />
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <RemoveFromWishlist
                onDelete={handleRemoveItem}
                sku={item.sku}
                slug={item.slug}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
