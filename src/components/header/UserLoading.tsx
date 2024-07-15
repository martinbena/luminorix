import { SKELETON_EFFECT } from "@/lib/constants";
import { SkeletonAvatar } from "skeleton-elements/react";

export default function UserLoadingSkeleton() {
  return (
    <>
      <div className="rounded-full flex justify-center items-center p-0.5 bg-amber-200 mob:w-9 mob:h-9">
        <SkeletonAvatar
          size={48}
          color="#d4d4d4"
          iconColor="#27272A"
          effect={SKELETON_EFFECT}
          tag="span"
          showIcon={false}
          borderRadius="50%"
        />
      </div>
      <div className="rounded-full flex justify-center items-center p-0.5 bg-amber-200 mob:w-9 mob:h-9">
        <SkeletonAvatar
          size={48}
          color="#d4d4d4"
          iconColor="#27272A"
          effect={SKELETON_EFFECT}
          tag="span"
          showIcon={true}
          borderRadius="50%"
        />
      </div>
    </>
  );
}
