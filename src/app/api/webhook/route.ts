import { CartProductProps } from "@/app/contexts/CartContext";
import ConnectDB from "@/db/connectDB";
import { getProductVariantsBySkus } from "@/db/queries/product";
import {
  updateProductAndVariantSold,
  updateVariantStockBySku,
} from "@/db/queries/products";
import Order from "@/models/Order";
import { NextResponse, NextRequest } from "next/server";

interface MetadataCartItem {
  sku: string;
  quantity: number;
}

interface ProductMap {
  [sku: string]: CartProductProps;
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  await ConnectDB();

  const _raw = await req.text();
  const signature = req.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      _raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        const { id, ...rest } = chargeSucceeded;

        const cartItems = JSON.parse(chargeSucceeded.metadata.cartItems);
        const productSkus = cartItems.map((item: MetadataCartItem) => item.sku);
        const products = await getProductVariantsBySkus(productSkus);

        const productMap: ProductMap = products.reduce((map, product) => {
          map[product.sku] = {
            _id: product._id,
            sku: product.sku,
            title: product.title,
            color: product.color,
            size: product.size,
            slug: product.slug,
            price: product.price,
            image: product.image,
            brand: product.brand,
            stock: product.stock,
            freeShipping: product.freeShipping,
          };
          return map;
        }, {} as ProductMap);

        const cartItemsWithProductDetails = cartItems.map(
          (item: MetadataCartItem) => ({
            ...productMap[item.sku],
            quantity: item.quantity,
          })
        );

        const orderData = {
          ...rest,
          chargeId: id,
          userId: chargeSucceeded.metadata.userId,
          delivery_telephone: chargeSucceeded.metadata.telephone,
          delivery_email: chargeSucceeded.receipt_email,
          cartItems: cartItemsWithProductDetails,
        };

        await Order.create(orderData);

        for (const cartItem of cartItems) {
          await updateVariantStockBySku(
            cartItem.sku,
            cartItem.quantity,
            "decrement"
          );
          await updateProductAndVariantSold(
            cartItem.sku,
            cartItem.quantity,
            "increment"
          );
        }

        return NextResponse.json({ ok: true });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({
      error: "Server error. Please try again",
      status: 500,
    });
  }
}
