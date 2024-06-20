import { SKELETON_EFFECT } from "@/lib/constants";
import {
  SkeletonAvatar,
  SkeletonBlock,
  SkeletonText,
} from "skeleton-elements/react";

export default function ReviewsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <ReviewSkeleton />
      <ReviewSkeleton />
      <ReviewSkeleton />
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex border border-amber-500">
      <div className="px-6 py-3 flex-grow">
        <div className="mb-2.5">
          <SkeletonBlock
            tag="h3"
            width="180px"
            height="29px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>

        <div className="mb-3 flex gap-1 items-center">
          <BallSkeleton />
          <BallSkeleton />
          <BallSkeleton />
          <BallSkeleton />
          <BallSkeleton />
        </div>
        <SkeletonText tag="p" effect={SKELETON_EFFECT}>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla
          pulvinar eleifend sem. Aenean placerat. Maecenas lorem.
        </SkeletonText>

        <div className="flex justify-between mt-4">
          <span>&nbsp;</span>
          <span>
            <SkeletonBlock
              tag="span"
              width="150px"
              height="10px"
              borderRadius="0"
              effect={SKELETON_EFFECT}
            />
          </span>
        </div>
      </div>
      <div className="flex flex-col border-l border-amber-500 w-24 mob:w-12">
        <ButtonSkeleton />
        <ButtonSkeleton />
      </div>
    </div>
  );
}

function BallSkeleton() {
  return (
    <SkeletonAvatar
      tag="span"
      size={15}
      color="#f59e0b"
      iconColor=""
      showIcon={false}
      borderRadius="999px"
      effect={SKELETON_EFFECT}
    />
  );
}

function ButtonSkeleton() {
  return (
    <div className="flex items-center gap-2 [&:not(:last-child)]:border-b border-amber-500 flex-grow px-3">
      <SkeletonBlock
        tag="span"
        width="20px"
        height="20px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      <div className="mob:hidden">
        <SkeletonBlock
          tag="span"
          width="45px"
          height="16px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
    </div>
  );
}
