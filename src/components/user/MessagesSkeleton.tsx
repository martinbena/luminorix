import { SKELETON_EFFECT } from "@/lib/constants";
import { SkeletonBlock, SkeletonText } from "skeleton-elements/react";

export default function MessagesSkeleton() {
  return (
    <div className="mt-12 flex flex-col gap-4">
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
    </div>
  );
}

function Message() {
  return (
    <div className="relative bg-white p-4 flex flex-col gap-4 rounded-md shadow-sm border border-zinc-200 font-sans">
      <SkeletonBlock
        tag="h2"
        width="240px"
        height="24px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      <SkeletonText tag="div" effect={SKELETON_EFFECT}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet
        ante dui. Praesent ut aliquam metus. Phasellus consectetur non eros eu
        gravida. Vestibulum faucibus laoreet leo, ac molestie felis tincidunt
        semper. Vivamus lorem ipsum, sagittis nec blandit sed, accumsan sed
        dolor.
      </SkeletonText>

      <ul className="flex flex-col gap-1">
        <SkeletonBlock
          tag="p"
          width="185px"
          height="20px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="p"
          width="185px"
          height="20px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="p"
          width="185px"
          height="20px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </ul>

      <div className="flex gap-3">
        <SkeletonBlock
          tag="button"
          width="115px"
          height="32px"
          borderRadius="6px"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="button"
          width="70px"
          height="32px"
          borderRadius="6px"
          effect={SKELETON_EFFECT}
        />
      </div>
    </div>
  );
}
