"use client";

import { useFilterContext } from "@/app/contexts/FilterContext";
import { SKELETON_EFFECT } from "@/lib/constants";
import { formatNumber } from "@/lib/helpers";
import { PropsWithChildren } from "react";
import { Range, getTrackBackground } from "react-range";
import { SkeletonAvatar, SkeletonBlock } from "skeleton-elements/react";
import Stars from "../products/Stars";

function Filter({ children }: PropsWithChildren) {
  return (
    <div className="bg-white py-3 px-4 font-sans flex flex-col gap-4 text-zinc-800 mx-2">
      {children}
    </div>
  );
}

interface BoxProps {
  filterType: "brands" | "colors" | "sizes" | "ratings" | "price";
  isReversed?: boolean;
}

function Box({ filterType, isReversed = false }: BoxProps) {
  const { state, handleCheckboxChange } = useFilterContext();
  const { options, filters, counts } = state;

  const items = filterType !== "price" ? options[filterType] : [];
  const selectedFilters = filterType !== "price" ? filters[filterType] : [];
  const itemCounts = filterType !== "price" ? counts[filterType] : [];

  const sortedItems = items.sort((a, b) => {
    if (typeof a === "string" && typeof b === "string") {
      return isReversed ? b.localeCompare(a) : a.localeCompare(b);
    } else if (typeof a === "number" && typeof b === "number") {
      return isReversed ? b - a : a - b;
    }
    return 0;
  });

  return (
    <div>
      <h4 className="font-bold border-b capitalize border-zinc-300 pb-1">
        {filterType}
      </h4>
      <div className="my-2 flex flex-col child:py-0.5">
        {filterType === "price" ? (
          <PriceRange />
        ) : (
          sortedItems
            .filter((item) => item)
            .map((item: string) => (
              <div
                className="flex gap-2 items-center child:cursor-pointer"
                key={item}
              >
                <input
                  id={item}
                  type="checkbox"
                  className="[&:hover+label]:underline [&:hover+label]:disabled:no-underline [&:hover+label]:disabled:cursor-default disabled:cursor-default [&+label]:disabled:opacity-70"
                  checked={selectedFilters.includes(item)}
                  onChange={() => handleCheckboxChange(filterType, item)}
                  disabled={
                    (itemCounts.find((i) => i.name === item)?.count ===
                      undefined ||
                      itemCounts.find((i) => i.name === item)?.count === 0) &&
                    !selectedFilters.includes(item)
                  }
                />
                <label
                  className="hover:underline flex items-center gap-1"
                  htmlFor={item}
                >
                  {selectedFilters.includes(item) ? (
                    <span className="font-bold">
                      {filterType === "ratings" ? (
                        <Stars rating={+item} />
                      ) : (
                        item
                      )}
                    </span>
                  ) : (
                    <>
                      {filterType === "ratings" ? (
                        <Stars rating={+item} />
                      ) : (
                        item
                      )}{" "}
                      <span className="text-amber-700">
                        (
                        {selectedFilters.length &&
                        !selectedFilters.includes(item) &&
                        (itemCounts.find((i) => i.name === item)?.count ?? 0) >
                          0
                          ? "+"
                          : ""}
                        {itemCounts.find((i) => i.name === item)?.count || 0})
                      </span>
                    </>
                  )}
                </label>
              </div>
            ))
        )}
      </div>

      {filterType === "price" ? (
        <div className="price-values flex justify-between text-base child:border child:border-zinc-300 child:px-2 child:py-1">
          <span>{formatNumber(filters.minPrice)}</span>
          <span>{formatNumber(filters.maxPrice)}</span>
        </div>
      ) : null}
    </div>
  );
}

function PriceRange() {
  const { state, dispatch, handlePriceChange } = useFilterContext();
  const { filters, priceRange } = state;
  return (
    <Range
      values={[+filters.minPrice, +filters.maxPrice]}
      step={50}
      min={priceRange[0]}
      max={priceRange[1]}
      onChange={(values) =>
        dispatch({
          type: "SET_FILTERS",
          payload: {
            minPrice: values[0].toString(),
            maxPrice: values[1].toString(),
          },
        })
      }
      onFinalChange={handlePriceChange}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: "36px",
            display: "flex",
            width: "100%",
          }}
        >
          <div
            ref={props.ref}
            style={{
              height: "5px",
              width: "100%",
              borderRadius: "4px",
              background: getTrackBackground({
                values: [Number(filters.minPrice), Number(filters.maxPrice)],
                colors: ["#ccc", "#f59e0b", "#ccc"],
                min: priceRange[0],
                max: priceRange[1],
              }),
              alignSelf: "center",
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => {
        const { key, ...restProps } = props;
        return (
          <div
            key={key}
            {...restProps}
            style={{
              ...props.style,
              height: "24px",
              width: "24px",
              borderRadius: "12px",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 2px 6px #AAA",
            }}
          >
            <div
              style={{
                height: "16px",
                width: "5px",
                backgroundColor: isDragged ? "#f59e0b" : "#CCC",
              }}
            />
          </div>
        );
      }}
    />
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonRange />
      <SkeletonBox />
      <SkeletonBox />
      <SkeletonBox />
      <SkeletonBox />
    </div>
  );
}

function SkeletonRange() {
  return (
    <div className="mb-2">
      <div className="border-b border-zinc-300 pb-1">
        <SkeletonBlock
          tag="p"
          width="70px"
          height="20px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
      <div className="my-2 flex justify-center items-center child:py-0.5">
        <SkeletonAvatar
          tag="span"
          size={30}
          color="#f000000"
          showIcon={false}
          effect={SKELETON_EFFECT}
          borderRadius="50%"
          iconColor=""
        />
        <SkeletonBlock
          tag="span"
          width="150px"
          height="7px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonAvatar
          tag="span"
          size={30}
          color="#f000000"
          showIcon={false}
          effect={SKELETON_EFFECT}
          borderRadius="50%"
          iconColor=""
        />
      </div>
      <div className="flex justify-between">
        <SkeletonBlock
          tag="span"
          width="40px"
          height="30px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="span"
          width="40px"
          height="30px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
    </div>
  );
}

function SkeletonBox() {
  return (
    <div>
      <div className="border-b border-zinc-300 pb-1">
        <SkeletonBlock
          tag="p"
          width="70px"
          height="20px"
          borderRadius="0"
          effect={SKELETON_EFFECT}
        />
      </div>
      <div className="my-2 flex flex-col child:py-2">
        <div className="flex items-center gap-2">
          <SkeletonAvatar
            tag="span"
            size={20}
            color="#f000000"
            showIcon={false}
            effect={SKELETON_EFFECT}
            borderRadius="0"
            iconColor=""
          />
          <SkeletonBlock
            tag="span"
            width="70px"
            height="15px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonAvatar
            tag="span"
            size={20}
            color="#f000000"
            showIcon={false}
            effect={SKELETON_EFFECT}
            borderRadius="0"
            iconColor=""
          />
          <SkeletonBlock
            tag="span"
            width="100px"
            height="15px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonAvatar
            tag="span"
            size={20}
            color="#f000000"
            showIcon={false}
            effect={SKELETON_EFFECT}
            borderRadius="0"
            iconColor=""
          />
          <SkeletonBlock
            tag="span"
            width="150px"
            height="15px"
            borderRadius="0"
            effect={SKELETON_EFFECT}
          />
        </div>
      </div>
    </div>
  );
}

Filter.Box = Box;
Filter.PriceRange = PriceRange;
Filter.Skeleton = Skeleton;

export default Filter;
