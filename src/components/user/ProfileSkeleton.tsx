import { SKELETON_EFFECT } from "@/lib/constants";
import { PropsWithChildren } from "react";
import { SkeletonAvatar, SkeletonBlock } from "skeleton-elements/react";

export default function ProfileSkeleton() {
  return (
    <>
      <UserInfo />
      <UserStats />

      <div className="grid grid-cols-2 gap-4 tab-xl:grid-cols-1">
        <ProfileFeature>
          {" "}
          <ul className="flex flex-col gap-6">
            <RecentOrderItem />
            <RecentOrderItem />
            <RecentOrderItem />
            <RecentOrderItem />
            <RecentOrderItem />
          </ul>
        </ProfileFeature>
        <ProfileFeature>
          <Chart />
        </ProfileFeature>
      </div>
    </>
  );
}

function UserInfo() {
  return (
    <div className="flex gap-12 mob-sm:flex-col mob-sm:items-center mob-sm:gap-6 mob-sm:text-center">
      <SkeletonAvatar
        size={192}
        color="#d4d4d4"
        iconColor="#27272A"
        effect={SKELETON_EFFECT}
        tag="span"
        showIcon={true}
        borderRadius="50%"
      />

      <div className="flex flex-col gap-4 justify-center">
        <SkeletonBlock
          tag="p"
          height="36px"
          width="170px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="p"
          height="24px"
          width="220px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
    </div>
  );
}

function UserStats() {
  return (
    <div className="grid grid-cols-4 gap-4 tab-xl:grid-cols-2 mob:grid-cols-1">
      <Stat />
      <Stat />
      <Stat />
      <Stat />
    </div>
  );
}

function Stat() {
  return (
    <div className="p-4 flex items-center gap-4 shadow-form rounded-md">
      <SkeletonBlock
        tag="span"
        height="64px"
        width="64px"
        borderRadius="50%"
        effect={SKELETON_EFFECT}
      />

      <div className="flex flex-col gap-1">
        <SkeletonBlock
          tag="p"
          height="12px"
          width="65px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="p"
          height="28px"
          width="18px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
    </div>
  );
}

function ProfileFeature({ children }: PropsWithChildren) {
  return (
    <div className="shadow-form p-8 mob:px-4 rounded-md flex flex-col gap-8">
      <SkeletonBlock
        tag="h3"
        height="32px"
        width="170px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
      {children}
    </div>
  );
}

function Chart() {
  return (
    <>
      <div className="flex justify-center items-center py-4">
        <SkeletonBlock
          tag="span"
          height="220px"
          width="220px"
          borderRadius="50%"
          effect={SKELETON_EFFECT}
        />
      </div>
      <div className="flex items-center gap-2">
        <ChartLegendItem />
        <ChartLegendItem />
        <ChartLegendItem />
      </div>
    </>
  );
}

function ChartLegendItem() {
  return (
    <div className="flex items-center gap-1">
      <SkeletonBlock
        tag="span"
        height="15px"
        width="15px"
        borderRadius="50%"
        effect={SKELETON_EFFECT}
      />
      <SkeletonBlock
        tag="p"
        height="16px"
        width="60px"
        borderRadius="0"
        effect={SKELETON_EFFECT}
      />
    </div>
  );
}

function RecentOrderItem() {
  return (
    <li className="grid grid-cols-[3rem_1fr_max-content] mob-sm:grid-cols-[1fr_max-content] gap-5 mob:gap-4">
      <div className="mob-sm:hidden">
        <SkeletonBlock
          tag="span"
          height="48px"
          width="48px"
          borderRadius="6px"
          effect={SKELETON_EFFECT}
        />
      </div>

      <div className="flex flex-col justify-between">
        <div className="block mob-sm:hidden">
          <SkeletonBlock
            tag="p"
            height="20px"
            width="210px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
        <div className="hidden mob-sm:block">
          <SkeletonBlock
            tag="p"
            height="20px"
            width="140px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>

        <div className="text-zinc-500 text-xs flex items-center gap-3 mt-2">
          <SkeletonBlock
            tag="span"
            height="16px"
            width="30px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
          <SkeletonBlock
            tag="span"
            height="16px"
            width="45px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <SkeletonBlock
          tag="p"
          height="20px"
          width="75px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="p"
          height="16px"
          width="65px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
    </li>
  );
}
