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
  );
}
