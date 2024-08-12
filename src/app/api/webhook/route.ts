import { CartItem, CartProductProps } from "@/app/contexts/CartContext";
import ConnectDB from "@/db/connectDB";
import { getProductVariantsBySkus } from "@/db/queries/product";
import {
  updateProductAndVariantSold,
  updateVariantStockBySku,
} from "@/db/queries/products";
import { SHIPPING_RATE } from "@/lib/constants";
import { formatCurrency } from "@/lib/helpers";
import { Category } from "@/models/Category";
import Order, { CartSession, LineItem } from "@/models/Order";
import User, { WishlistItem } from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const maxDuration = 60;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_AUTH_USER,
    pass: process.env.GMAIL_AUTH_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

interface MetadataCartItem {
  sku: string;
  quantity: number;
  price: number;
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
        const { userId, sessionId, telephone } = chargeSucceeded.metadata;

        const cartSession = await CartSession.findOne({ sessionId });

        if (!cartSession) {
          throw new Error("Cart session not found");
        }

        const { lineItems } = cartSession;

        const cartItems = lineItems.map((item: LineItem) => {
          return {
            sku: item?.price_data?.product_data?.metadata?.sku,
            price: item.price_data.unit_amount / 100,
            quantity: item.quantity,
          };
        });
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
            category: (product.category as Category).title,
          };
          return map;
        }, {} as ProductMap);

        const cartItemsWithProductDetails = cartItems.map(
          (item: MetadataCartItem) => ({
            ...productMap[item.sku],
            price: item.price,
            quantity: item.quantity,
          })
        );

        const orderData = {
          ...rest,
          chargeId: id,
          userId,
          delivery_telephone: telephone,
          delivery_email: chargeSucceeded.receipt_email,
          cartItems: cartItemsWithProductDetails,
          success_token: sessionId,
        };

        const order = await Order.create(orderData);

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

        const emailSubject = `Order from Luminorix no. ${order._id
          .toString()
          .slice(-5)}`;
        const hasFreeShipping = cartItemsWithProductDetails.some(
          (item: CartItem) => item.freeShipping
        );

        const mailOptions = {
          to: chargeSucceeded.receipt_email,
          from: process.env.GMAIL_AUTH_USER,
          subject: emailSubject,
          html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #D97706;">Thank you for your order, <strong>${
        orderData.shipping.name
      }</strong>!</h2>
      <p>We appreciate your purchase and are processing your order.</p>
      <h3 style="color: #D97706;">Order Recap</h3>
      <div style="border-top: 1px solid #D97706; margin-top: 10px; padding-top: 10px;">
        <h4 style="margin: 0;">Shipping Address</h4>
        <p style="margin: 5px 0;">
          <strong>${orderData.shipping.name}</strong><br/>
          ${orderData.shipping.address.line1}<br/>
          ${
            orderData.shipping.address.line2
              ? `${orderData.shipping.address.line2}<br/>`
              : ""
          }
          ${orderData.shipping.address.city},${
            orderData.shipping.address.state
              ? ` ${orderData.shipping.address.state}`
              : ""
          } ${orderData.shipping.address.postal_code}<br/>
          ${orderData.shipping.address.country}
        </p>
      </div>
      <div style="border-top: 1px solid #D97706; margin-top: 10px; padding-top: 10px;">
        <h4 style="margin: 0;">Ordered Products</h4>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 5px; border-bottom: 1px solid #D97706;">Product</th>
              <th style="text-align: left; padding: 5px; border-bottom: 1px solid #D97706;">Details</th>
              <th style="text-align: left; padding: 5px; border-bottom: 1px solid #D97706;">Quantity</th>
              <th style="text-align: left; padding: 5px; border-bottom: 1px solid #D97706;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${cartItemsWithProductDetails
              .map(
                (item: CartItem) => `
              <tr>
                <td style="padding: 5px; border-bottom: 1px solid #eaeaea;"><strong>${
                  item.title
                }</strong></td>
                <td style="padding: 5px; border-bottom: 1px solid #eaeaea;">
                  ${item.color ? `<div>Color: ${item.color}</div>` : ""}
                  ${item.size ? `<div>Size: ${item.size}</div>` : ""}
                </td>
                <td style="padding: 5px; border-bottom: 1px solid #eaeaea;">${
                  item.quantity
                }</td>
                <td style="padding: 5px; border-bottom: 1px solid #eaeaea;">${formatCurrency(
                  item.price
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        </div>
        <div style="border-top: 1px solid #D97706; margin-top: 20px; padding-top: 10px;">
        <h4 style="margin: 0;">Shipping Cost: <strong>${
          hasFreeShipping ? "Free" : `${formatCurrency(SHIPPING_RATE)}`
        }</strong></h4>
          <h3>Total Price: <strong>${formatCurrency(
            orderData.amount_captured / 100
          )}</strong></h3>
          <p>If you have any questions or concerns, please contact our support team.</p>
          <p>Thank you for shopping with us!</p>
        </div>    
      </div>
    `,
        };

        await transporter.sendMail(mailOptions);

        await CartSession.deleteOne({ sessionId });

        if (userId !== "not-logged-in") {
          const user = await User.findById(userId);
          if (!user) return;

          const wishlistSkus = user.wishlist.map(
            (item: WishlistItem) => item.sku
          );
          const skusToRemove = wishlistSkus.filter((sku: string) =>
            productSkus.includes(sku)
          );

          if (skusToRemove.length > 0) {
            user.wishlist = user.wishlist.filter(
              (item: WishlistItem) => !skusToRemove.includes(item.sku)
            );
            await user.save();
          }
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
