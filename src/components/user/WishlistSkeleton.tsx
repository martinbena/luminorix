import { SKELETON_EFFECT } from "@/lib/constants";
import { SkeletonBlock } from "skeleton-elements/react";

export default function WishlistSkeleton() {
  return (
    <ul className="border border-zinc-300 max-w-5xl mx-auto rounded-md">
      <WishlistItemSkeleton />
      <WishlistItemSkeleton />
      <WishlistItemSkeleton />
    </ul>
  );
}

function WishlistItemSkeleton() {
  return (
    <li className="grid relative grid-cols-[150px_2.5fr_1.5fr] tab-lg:grid-cols-[150px_1fr] mob:grid-cols-1 p-8 mob:px-4 mob:py-6 gap-x-8 gap-y-4 [&:not(:last-child)]:border-b border-zinc-200">
      <div className="w-full aspect-square mob:h-[150px] mob:w-[150px] mob:mx-auto">
        <SkeletonBlock
          tag="img"
          width="100%"
          height="100%"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>

      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div className="w-[300px] mob-sm:w-full">
            <SkeletonBlock
              tag="h3"
              width="100%"
              height="29px"
              borderRadius="0"
              effect={SKELETON_EFFECT}
            />
          </div>

          <SkeletonBlock
            tag="p"
            width="100px"
            height="20px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>

        <div className="mob:mt-3">
          <SkeletonBlock
            tag="p"
            width="150px"
            height="32px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between tab-lg:col-span-2 mob:col-span-1">
        <div className="mt-auto flex flex-col gap-2">
          <SkeletonBlock
            tag="button"
            width="100%"
            height="44px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
          <SkeletonBlock
            tag="button"
            width="100%"
            height="44px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>

        <div className="absolute top-2 right-2">
          <SkeletonBlock
            tag="button"
            width="24px"
            height="24px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
      </div>
    </li>
  );
}
