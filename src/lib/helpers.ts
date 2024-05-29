import { useSearchParams } from "next/navigation";
import cloudinary from "./cloudinary";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export async function uploadIamgeToCloudinaryAndGetUrl(
  image: File
): Promise<string> {
  const imageBuffer = await image.arrayBuffer();
  const imageArray = Array.from(new Uint8Array(imageBuffer));
  const imageData = Buffer.from(imageArray);

  const imageBase64 = imageData.toString("base64");

  const uploadResult = await cloudinary.uploader.upload(
    `data:image/png;base64,${imageBase64}`,
    { folder: "luminorix" }
  );

  return uploadResult.secure_url;
}

export async function removeImageFromCloudinary(
  imageUrl: string
): Promise<void> {
  const imageUrlParts = imageUrl.split("/");
  const imagePublicId = imageUrlParts?.at(-1)?.split(".").at(0);
  await cloudinary.uploader.destroy(`luminorix/${imagePublicId}`);
}

export const useMergedSearchParams = (href: string) => {
  const searchParams = useSearchParams();

  if (!href.includes("?")) {
    return href;
  }

  const url = new URL(href, window.location.origin);
  const currentParams = new URLSearchParams(searchParams.toString());

  url.searchParams.forEach((value, key) => {
    currentParams.set(key, value);
  });

  return `${url.pathname}?${currentParams.toString()}`;
};
