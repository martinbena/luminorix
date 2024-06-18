"use client";

import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";

interface ProductImageProps {
  image: string;
  title: string;
  size: {
    width: number;
    height: number;
  };
}

export default function ProductImage({
  image,
  title,
  size,
}: ProductImageProps) {
  return (
    <div
      className={`relative w-full min-h-[550px] mob-lg:min-h-96 mob-sm:min-h-60 overflow-hidden ${
        Math.round(size.width / size.height) === 1
          ? "aspect-square"
          : "aspect-video"
      }`}
    >
      <Gallery>
        <Item
          original={image}
          thumbnail={image}
          width={size.width}
          height={size.height}
        >
          {({ ref, open }) => (
            <Image
              ref={ref}
              onClick={open}
              src={image}
              alt={`Image of ${title}`}
              fill
              sizes="50vw"
              className="object-cover cursor-pointer"
            />
          )}
        </Item>
      </Gallery>
    </div>
  );
}
