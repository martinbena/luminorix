import { SKELETON_EFFECT } from "@/lib/constants";
import { PropsWithChildren } from "react";
import { SkeletonBlock } from "skeleton-elements/react";

export default function HeaderFeatureSkeleton() {
  return (
    <div>
      <div className="[&>*:nth-child(1)]:h-16 [&>*:nth-child(1)]:w-16 tab-xl:[&>*:nth-child(1)]:h-12 tab-xl:[&>*:nth-child(1)]:w-12 mob:[&>*:nth-child(1)]:w-9 mob:[&>*:nth-child(1)]:h-9 flex items-center gap-3 tab-xl:[&>*:nth-child(2)]:hidden">
        <div className="pl-[0.1px] bg-amber-200 rounded-full">
          <SkeletonBlock
            tag="span"
            height="100%"
            width="100%"
            borderRadius="50%"
            effect={SKELETON_EFFECT}
          />
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <TextContainer>
            <SkeletonBlock
              tag="p"
              height="20px"
              width="60px"
              borderRadius="0"
              effect={SKELETON_EFFECT}
            />
          </TextContainer>

          <TextContainer>
            <SkeletonBlock
              tag="p"
              height="16px"
              width="80px"
              borderRadius="0"
              effect={SKELETON_EFFECT}
            />
          </TextContainer>
        </div>
      </div>
    </div>
  );
}

function TextContainer({ children }: PropsWithChildren) {
  return <div className="pl-[0.1px] bg-amber-200 max-w-max">{children}</div>;
}
