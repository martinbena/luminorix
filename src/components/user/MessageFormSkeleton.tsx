import { SKELETON_EFFECT } from "@/lib/constants";
import { SkeletonBlock, SkeletonText } from "skeleton-elements/react";

export default function MessageFormSkeleton() {
  return (
    <div className="px-6 py-8 rounded-md shadow-form max-w-2xl w-full bg-white text-center">
      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <SkeletonBlock
            tag="h2"
            width="240px"
            height="28px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>

        <SkeletonText tag="p" effect={SKELETON_EFFECT}>
          Your name and e-mail address will be provided to the seller from your
          account information
        </SkeletonText>
        <SkeletonBlock
          tag="div"
          width="100%"
          height="50px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="div"
          width="100%"
          height="120px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />

        <div className="mob-sm:hidden">
          <SkeletonBlock
            tag="button"
            width="312px"
            height="44px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>

        <div className="hidden mob-sm:block">
          <SkeletonBlock
            tag="button"
            width="100%"
            height="44px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
      </div>
    </div>
  );
}
