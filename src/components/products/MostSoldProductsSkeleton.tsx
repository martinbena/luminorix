import { SKELETON_EFFECT } from "@/lib/constants";
import { SkeletonAvatar, SkeletonBlock } from "skeleton-elements/react";

export default function MostSoldProductsSkeleton() {
  return (
    <section className="px-8 mob:px-5">
      <SkeletonBlock
        tag="h2"
        height="28px"
        width="300px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      <div className="flex flex-col gap-6 max-w-max mx-auto mt-8 mb-2">
        <div className="mb-2 flex justify-center mob:justify-start">
          <SkeletonBlock
            tag="h3"
            height="20px"
            width="225px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
        <Product />
        <Product />
        <Product />
      </div>
    </section>
  );
}

function Product() {
  return (
    <div className="grid grid-cols-[max-content_1fr_max-content] items-center gap-8 mob:gap-5">
      <div className="flex items-center gap-4">
        <SkeletonAvatar
          tag="span"
          size={32}
          color=""
          showIcon={false}
          iconColor=""
          borderRadius="999px"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="img"
          height="40px"
          width="40px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
      <SkeletonBlock
        tag="p"
        height="28px"
        width="175px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      <SkeletonBlock
        tag="p"
        height="20px"
        width="90px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
    </div>
  );
}
