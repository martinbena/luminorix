import { SkeletonBlock } from "skeleton-elements/react";

interface ProductRowSkeletonProps {
  hasTitle?: boolean;
  gridSize?: string;
  numItems: number;
}

export default function ProductRowSkeleton({
  hasTitle = false,
  gridSize = "small",
  numItems = 4,
}: ProductRowSkeletonProps) {
  const effect = "wave";

  return (
    <section className={`px-8 mob:px-5`}>
      {hasTitle && (
        <SkeletonBlock
          tag="h2"
          height="28px"
          width="300px"
          borderRadius="0"
          effect={effect}
        />
      )}
      <div
        className={`mt-8 grid gap-8 dt-sm:gap-4 max-w-8xl mx-auto ${
          gridSize === "small"
            ? "grid-cols-[repeat(auto-fit,_minmax(14rem,_1fr))] dt-sm:grid-cols-[repeat(auto-fit,_minmax(12rem,_1fr))]"
            : "grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] dt:grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))] mob:grid-cols-1"
        }`}
      >
        {Array.from({ length: numItems }).map((_, index) => (
          <article
            key={index}
            className="h-full flex bg-zinc-100 flex-col shadow-sm"
          >
            <div className="relative aspect-square overflow-hidden">
              <SkeletonBlock
                tag="div"
                height="100%"
                width="100%"
                borderRadius="0"
                effect={effect}
              />
            </div>

            <div className="pt-8 pb-6 dt-sm:p-4 px-5 flex flex-col justify-between flex-1">
              <div>
                <SkeletonBlock
                  tag="h3"
                  height="28px"
                  width="70%"
                  borderRadius="0"
                  effect={effect}
                />
                <div className="mb-6 mt-1.5">
                  <SkeletonBlock
                    tag="p"
                    height="28px"
                    width="25%"
                    borderRadius="0"
                    effect={effect}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <SkeletonBlock
                  tag="div"
                  height="44px"
                  width="100%"
                  borderRadius="0"
                  effect={effect}
                />
                <SkeletonBlock
                  tag="div"
                  height="44px"
                  width="100%"
                  borderRadius="0"
                  effect={effect}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
