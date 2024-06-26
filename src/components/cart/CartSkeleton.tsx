import { SKELETON_EFFECT } from "@/lib/constants";
import { PropsWithChildren } from "react";
import { SkeletonBlock } from "skeleton-elements/react";

export default function CartSkeleton() {
  return (
    <section className="mt-16 grid grid-cols-[2fr_1fr] gap-8">
      <div>
        <ColumnHeader />

        <ColumnContainer>
          <CartItemSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </ColumnContainer>
        <div className="flex justify-between items-center mt-6"></div>
      </div>
      <div>
        <ColumnHeader />
        <ColumnContainer>
          <OrderSummaryItemSkeleton />
          <OrderSummaryItemSkeleton />
          <OrderSummaryItemSkeleton />

          <TotalPriceSkeleton />
        </ColumnContainer>
      </div>
    </section>
  );
}

function ColumnHeader() {
  return (
    <div className="mb-8">
      <SkeletonBlock
        tag="div"
        height="40px"
        width="100%"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
    </div>
  );
}

function ColumnContainer({ children }: PropsWithChildren) {
  return <ul className="flex flex-col gap-4">{children}</ul>;
}

function CartItemSkeleton() {
  return (
    <li className="flex gap-6 border border-zinc-300 rounded-md p-2">
      <div className="aspect-square w-48">
        <SkeletonBlock
          tag="img"
          height="100%"
          width="100%"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-7">
          <SkeletonBlock
            tag="h3"
            height="27px"
            width="250px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
          <SkeletonBlock
            tag="p"
            height="24px"
            width="115px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
        <div className="flex justify-center items-center gap-2">
          <SkeletonBlock
            tag="button"
            height="44px"
            width="152px"
            borderRadius="999px"
            effect={SKELETON_EFFECT}
          />
          <SkeletonBlock
            tag="button"
            height="40px"
            width="40px"
            borderRadius="999px"
            effect={SKELETON_EFFECT}
          />
        </div>
      </div>
    </li>
  );
}

function OrderSummaryItemSkeleton() {
  return (
    <li className="flex gap-6 border border-zinc-300 rounded-md p-2">
      <div className="aspect-square w-16">
        <SkeletonBlock
          tag="img"
          height="100%"
          width="100%"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <SkeletonBlock
          tag="h4"
          height="20px"
          width="180px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <div className="flex items-center justify-between">
          <SkeletonBlock
            tag="p"
            height="24px"
            width="80px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
          <SkeletonBlock
            tag="p"
            height="20px"
            width="35px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
      </div>
    </li>
  );
}

function TotalPriceSkeleton() {
  return (
    <div className="flex justify-between font-sans items-center">
      <SkeletonBlock
        tag="p"
        height="24px"
        width="100px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      <SkeletonBlock
        tag="span"
        height="32px"
        width="125px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
    </div>
  );
}
