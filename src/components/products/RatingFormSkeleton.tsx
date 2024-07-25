import { SKELETON_EFFECT } from "@/lib/constants";
import { SkeletonBlock } from "skeleton-elements/react";

export default function RatingFormSkeleton() {
  return (
    <div className="px-6 py-8 rounded-md shadow-form max-w-2xl w-full bg-white flex flex-col gap-8">
      <div className="flex justify-center items-center">
        <SkeletonBlock
          tag="h2"
          height="28px"
          width="180px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
      <SkeletonBlock
        tag="div"
        height="32px"
        width="160px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      <SkeletonBlock
        tag="div"
        height="120px"
        width="100%"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      <SkeletonBlock
        tag="button"
        height="44px"
        width="100%"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
    </div>
  );
}
