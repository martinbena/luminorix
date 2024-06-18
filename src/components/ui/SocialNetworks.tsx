"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import { ProductWithVariant } from "@/models/Product";
import { getProductVariantTitle } from "@/lib/helpers";

interface SocialNetworksProps {
  product: ProductWithVariant;
  slug: string;
  sku: string;
}

export default function SocialNetworks({
  product,
  slug,
  sku,
}: SocialNetworksProps) {
  const { brand, title, color, size } = product;
  const shareUrl = `${process.env.BASE_URL}/${slug}/${sku}`;
  const composedTitle = getProductVariantTitle(title, color, size);
  return (
    <div className="flex flex-col gap-6">
      <p className="font-semibold">Share</p>
      <div className="flex gap-3">
        <FacebookShareButton
          url={shareUrl}
          title={composedTitle}
          hashtag={`#Fancy${brand}ForSell`}
        >
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={composedTitle}
          hashtags={[`#Fancy${brand}ForSell`]}
        >
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={composedTitle}
          separator=":: "
        >
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={composedTitle}
          body={`Check out this ${brand}: ${shareUrl}`}
        >
          <EmailIcon size={40} round={true} />
        </EmailShareButton>
      </div>
    </div>
  );
}
