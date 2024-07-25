import { getColorAndSizeVariantsBySku } from "@/db/queries/product";
import { getAllWishlistItems } from "@/db/queries/wishlist";
import {
  formatCurrency,
  getDeliveryDateRange,
  getProductVariantTitle,
} from "@/lib/helpers";
import { ProductWithVariant } from "@/models/Product";
import colorNameList from "color-name-list";
import { ReactNode } from "react";
import { PiCalendarBlank, PiTruck } from "react-icons/pi";
import CartActions from "../cart/CartActions";
import SocialNetworks from "../ui/SocialNetworks";
import VariantLink from "./VariantLink";
import VariantSelector from "./VariantSelector";
import WishlistButton from "./WishlistButton";

interface ProductDetailsProps {
  product: ProductWithVariant;
  sku: string;
  slug: string;
}

export default async function ProductDetails({
  product,
  sku,
  slug,
}: ProductDetailsProps) {
  const {
    title,
    color,
    size,
    description,
    previousPrice,
    price,
    stock,
    freeShipping,
  } = product;

  const { uniqueColors, sizesByColor } = await getColorAndSizeVariantsBySku(
    sku
  );

  const wishlistItems = await getAllWishlistItems();

  return (
    <div className="font-sans mb-8">
      <Heading>{getProductVariantTitle(title, color, size)}</Heading>
      <Description>{description}</Description>
      <Price>
        {previousPrice > price && (
          <span className="mr-5 line-through text-zinc-600">
            {formatCurrency(previousPrice)}
          </span>
        )}
        <span className="font-semibold">{formatCurrency(price)}</span>
      </Price>

      <Divider />

      <div className="flex flex-col gap-8">
        <VariantSelector criterion="Color">
          {uniqueColors.map((item) => {
            const hexColor = colorNameList.find(
              (color) => color.name === item.color
            );
            return (
              <VariantLink
                key={item.color}
                slug={slug}
                sku={item.sku}
                selectedCriterion={color}
                criterionOption={item.color}
                hasDescription
                hexColor={hexColor}
              />
            );
          })}
        </VariantSelector>
        <VariantSelector criterion="Size for this color">
          {sizesByColor.map((item) => {
            return (
              <VariantLink
                key={item.size}
                slug={slug}
                sku={item.sku}
                selectedCriterion={size}
                criterionOption={item.size}
                hasDescription={false}
              />
            );
          })}
        </VariantSelector>
      </div>

      <div className="flex gap-10 font-semibold my-8">
        <p>{stock} in stock</p>

        <WishlistButton
          slug={slug}
          sku={sku}
          wishlistItems={JSON.parse(JSON.stringify(wishlistItems))}
        />
      </div>

      {stock > 0 ? (
        <div className="flex flex-col gap-2 max-w-sixty mob-lg:max-w-full">
          <CartActions product={JSON.parse(JSON.stringify(product))} />
        </div>
      ) : (
        <p>This product is not available at the moment.</p>
      )}

      <Divider />

      <div className="flex flex-col gap-6 mb-8">
        <ShippingInformation>
          <PiCalendarBlank /> <span>Delivery:</span>{" "}
          {stock > 0 ? getDeliveryDateRange() : "N/A"}
        </ShippingInformation>

        <ShippingInformation>
          <PiTruck />
          <span>Shipping:</span> {`${freeShipping ? "Free" : "$5"}`}{" "}
        </ShippingInformation>
      </div>

      <SocialNetworks
        product={JSON.parse(JSON.stringify(product))}
        slug={slug}
        sku={sku}
      />
    </div>
  );
}

function Divider() {
  return <hr className="text-zinc-400 my-8" />;
}

interface ProductDetailProps {
  children: ReactNode;
}

function Heading({ children }: ProductDetailProps) {
  return (
    <h2 className="font-semibold font-serif text-3xl mob-sm:text-2xl">
      {children}
    </h2>
  );
}

function Description({ children }: ProductDetailProps) {
  return <article className="mt-6 mb-8">{children}</article>;
}

function Price({ children }: ProductDetailProps) {
  return <p className="text-2xl mob-sm:text-xl">{children}</p>;
}

function ShippingInformation({ children }: ProductDetailProps) {
  return (
    <p className="flex items-center gap-1 [&>*:nth-child(1)]:w-5 [&>*:nth-child(1)]:h-5 [&>*:nth-child(2)]:font-semibold">
      {children}
    </p>
  );
}
