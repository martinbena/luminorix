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
  return (
    <div className="flex gap-3">
      <FacebookShareButton
        url={shareUrl}
        title={`${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
          size ? ` ${size}` : ""
        }`}
        hashtag={`#Fancy${brand}ForSell`}
      >
        <FacebookIcon size={40} round={true} />
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={`${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
          size ? ` ${size}` : ""
        }`}
        hashtags={[`#Fancy${brand}ForSell`]}
      >
        <TwitterIcon size={40} round={true} />
      </TwitterShareButton>

      <WhatsappShareButton
        url={shareUrl}
        title={`${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
          size ? ` ${size}` : ""
        }`}
        separator=":: "
      >
        <WhatsappIcon size={40} round={true} />
      </WhatsappShareButton>

      <EmailShareButton
        url={shareUrl}
        subject={`${title}${color || size ? "," : ""}${
          color ? ` ${color}` : ""
        }${size ? ` ${size}` : ""}`}
        body={`Check out this ${brand}: ${shareUrl}`}
      >
        <EmailIcon size={40} round={true} />
      </EmailShareButton>
    </div>
  );
}
