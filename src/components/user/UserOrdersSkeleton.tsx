import { SKELETON_EFFECT } from "@/lib/constants";
import { SkeletonBlock } from "skeleton-elements/react";

export default function UserOrdersSkeleton() {
  return (
    <div className="flex flex-col gap-6 child:w-full">
      <OrderSkeleton />
      <OrderSkeleton />
      <OrderSkeleton />
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="rounded-md border border-zinc-200 max-w-5xl w-full">
      <SkeletonBlock
        tag="div"
        height="57px"
        width="100%"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />

      <div className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100">
        <OrderItemSkeleton />
        <OrderItemSkeleton />
        <OrderItemSkeleton />
      </div>

      <SkeletonBlock
        tag="div"
        height="44px"
        width="100%"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
    </div>
  );
}

function OrderItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-2 px-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100">
      <div className="w-16 h-16 my-2 mob-sm:w-8 mob-sm:h-8">
        <SkeletonBlock
          tag="img"
          height="100%"
          width="100%"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <SkeletonBlock
          tag="h3"
          height="16px"
          width="200px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="p"
          height="16px"
          width="150px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
    </div>
  );
}
