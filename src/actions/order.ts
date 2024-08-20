"use server";

import { CartItem, DiscountCoupon } from "@/app/contexts/CartContext";
import { validateUserSession } from "@/auth";
import {
  getProductVariantsBySkus,
  hasFreeShipping,
} from "@/db/queries/product";
import {
  updateProductAndVariantSold,
  updateVariantStockBySku,
} from "@/db/queries/products";
import { ORDER_STATUSES, SHIPPING_RATE } from "@/lib/constants";
import { handleDataMutation } from "@/lib/handleDataMutation";
import {
  areAddressesDifferent,
  formatCurrency,
  getProductVariantTitle,
} from "@/lib/helpers";
import { transporter } from "@/lib/nodemailerTransporter";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import { Category } from "@/models/Category";
import Order, { CartSession } from "@/models/Order";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { DeleteItemState } from "./category";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentSessionSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: "Please enter a correct e-mail address",
  }),
  telephone: z.string().regex(/^\+[1-9]{1}[0-9]{1,3}[0-9\s().-]{7,14}$/, {
    message: "Please enter a correct telephone number with your area code",
  }),
});
const applyDiscountCouponSchema = z.object({
  coupon: z.string().min(5, { message: "Please enter a valid coupon code" }),
});

const editOrderSchema = z.object({
  ...createPaymentSessionSchema.shape,
  // @ts-ignore
  name: z.string().regex(/^[\p{L}'’\-]{2,}(?:\s[\p{L}'’\-]{2,})+$/u, {
    message: "Please enter a correct full name",
  }),
  country: z
    .string()
    .min(2, { message: "Please enter a valid country code" })
    .max(2, { message: "Please enter a valid country code" }),
  city: z.string().min(2, { message: "Please enter a valid city" }),
  street: z.string().min(2, { message: "Please enter a valid street" }),
  postalCode: z
    .string()
    .min(2, { message: "Please enter a valid postal code" }),
  deliveryStatus: z.enum(ORDER_STATUSES),
});

interface ApplyDiscountCouponFormState {
  errors: {
    coupon?: string[];
    _form?: string[];
  };
  coupon?: DiscountCoupon;
}

export async function applyDiscountCoupon(
  formState: ApplyDiscountCouponFormState,
  formData: FormData
): Promise<ApplyDiscountCouponFormState> {
  const { result, errors } = validateFormData(
    applyDiscountCouponSchema,
    formData
  );

  if (!result.success) {
    return {
      errors,
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const coupons = await stripe.promotionCodes.list({
      code: result.data.coupon,
      active: true,
    });

    if (coupons.data.length === 0) {
      throw new Error("Promotion code not found");
    }
    const coupon = coupons.data[0];
    return coupon;
  });

  return {
    errors: mutationResult.errors || {},
    coupon: mutationResult.data,
  };
}

interface CreatePaymentSessionFormState {
  errors: {
    email?: string[];
    telephone?: string[];
    _form?: string[];
  };
}

export async function createPaymentSession(
  cartItems: CartItem[],
  discountCoupon: DiscountCoupon | null,
  formState: CreatePaymentSessionFormState,
  formData: FormData
): Promise<CreatePaymentSessionFormState> {
  const { result, errors } = validateFormData(
    createPaymentSessionSchema,
    formData
  );

  if (!result.success) {
    return {
      errors,
    };
  }

  if (!cartItems.length) {
    return {
      errors: {
        _form: ["Please provide cart items before placing order"],
      },
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const { user } = await validateUserSession();
    const userId = user?._id;
    const cartSessionId = uuidv4();

    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const [product] = await getProductVariantsBySkus(item.sku);
        const composedTitle = getProductVariantTitle(
          product.title,
          product.color,
          product.size
        );
        if (item.quantity > product.stock) {
          throw new Error(
            `There is only ${product.stock} pieces of ${composedTitle} in stock. You have ${item.quantity} pieces in your cart `
          );
        }
        const finalPrice =
          discountCoupon &&
          (product.category as Category).title ===
            discountCoupon.metadata.category
            ? product.price * (1 - discountCoupon.coupon.percent_off / 100)
            : product.price;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: composedTitle,
              images: [product.image],
              metadata: {
                sku: product.sku,
              },
            },
            unit_amount: finalPrice * 100,
          },
          quantity: item.quantity,
        };
      })
    );

    await CartSession.create({
      sessionId: cartSessionId,
      lineItems,
    });

    const freeShipping = await hasFreeShipping(
      cartItems.map((item) => item.sku)
    );

    const metadata = {
      sessionId: cartSessionId,
      userId: userId || "not-logged-in",
      telephone: result.data.telephone,
    };

    const countryCodes = (process.env.STRIPE_COUNTRY_CODES ?? "").split(",");

    const paymentSession = await stripe.checkout.sessions.create({
      line_items: lineItems,
      success_url: `${process.env.BASE_URL}${paths.orderSuccess(
        cartSessionId
      )}`,
      client_reference_id: userId || "not-logged-in",
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: {
        metadata,
      },
      shipping_options: [
        {
          shipping_rate: freeShipping
            ? process.env.STRIPE_FREE_SHIPPING_RATE
            : process.env.STRIPE_SHIPPING_RATE,
        },
      ],
      shipping_address_collection: {
        allowed_countries: countryCodes,
      },
      customer_email: result.data.email,
    });

    redirect(paymentSession.url);
  });

  return {
    errors: mutationResult.errors || {},
  };
}

export async function cancelOrder(id: string): Promise<DeleteItemState> {
  const mutationResult = await handleDataMutation(
    async () => {
      const updatedOrder = await Order.findById(id);

      if (!updatedOrder) throw new Error("Order not found");

      const { authorized, authError } = await validateUserSession(
        updatedOrder.userId.toString()
      );

      if (
        updatedOrder.delivery_status !== "Not Processed" &&
        !(authorized && updatedOrder.delivery_status === "Processing")
      )
        throw new Error("This order cannot be cancelled");

      if (!authorized) throw new Error(authError);

      const refund = stripe.refunds.create({
        payment_intent: updatedOrder.payment_intent,
        reason: "requested_by_customer",
      });

      updatedOrder.status = "Refunded";
      updatedOrder.refunded = true;
      updatedOrder.delivery_status = "Cancelled";
      updatedOrder.refundId = refund.id;

      await updatedOrder.save();

      for (const cartItem of updatedOrder.cartItems) {
        await updateVariantStockBySku(
          cartItem.sku,
          cartItem.quantity,
          "increment"
        );
        await updateProductAndVariantSold(
          cartItem.sku,
          cartItem.quantity,
          "decrement"
        );
      }

      revalidatePath(paths.userOrderShowAll());
      revalidatePath(paths.admin());
      revalidatePath(paths.adminOrderShow());
      revalidatePath(paths.orderSuccess(updatedOrder.success_token));
    },
    "Order could not be cancelled. Please try again",
    false
  );

  return {
    success: mutationResult.success,
  };
}

interface EditOrderFormState {
  errors: {
    telephone?: string[];
    email?: string[];
    name?: string[];
    country?: string[];
    city?: string[];
    street?: string[];
    postalCode?: string[];
    deliveryStatus?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function editOrder(
  id: mongoose.Types.ObjectId,
  formState: EditOrderFormState,
  formData: FormData
): Promise<EditOrderFormState> {
  const { result, errors } = validateFormData(editOrderSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  const { authorized, authError } = await validateUserSession();
  if (!authorized) {
    return {
      errors: {
        _form: [authError],
      },
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const updatedOrder = await Order.findById(id);

    if (!updatedOrder) throw new Error("Order not found");

    const { delivery_status: deliveryStatus, shipping } = updatedOrder;
    const {
      email,
      telephone,
      name,
      country,
      city,
      street,
      postalCode,
      deliveryStatus: newDeliveryStatus,
    } = result.data;

    if (deliveryStatus === "Cancelled" || deliveryStatus === "Delivered")
      throw new Error("This order cannot be edited");

    const oldAddress = {
      name: shipping.name,
      ...shipping.address,
    };

    const newAddress = {
      name,
      country,
      city,
      line1: street,
      postal_code: postalCode,
    };

    const addressHasChanged = areAddressesDifferent(oldAddress, newAddress);

    if (
      ((deliveryStatus !== "Not Processed" &&
        deliveryStatus !== "Processing") ||
        (newDeliveryStatus !== "Not Processed" &&
          newDeliveryStatus !== "Processing")) &&
      (addressHasChanged ||
        updatedOrder.delivery_email !== email ||
        updatedOrder.delivery_telephone !== telephone)
    )
      throw new Error("Contact details cannot be changed at this stage");

    if (deliveryStatus === "Dispatched" && newDeliveryStatus !== "Delivered")
      throw new Error(
        "Order cannot be cancelled or returned to staff at this stage"
      );

    updatedOrder.delivery_email = email;
    updatedOrder.delivery_telephone = telephone;
    updatedOrder.shipping.name = name;
    updatedOrder.shipping.address = {
      country,
      city,
      line1: street,
      postal_code: postalCode,
    };
    updatedOrder.delivery_status = newDeliveryStatus;

    await updatedOrder.save();

    if (newDeliveryStatus === "Cancelled") {
      const refund = stripe.refunds.create({
        payment_intent: updatedOrder.payment_intent,
        reason: "requested_by_customer",
      });

      updatedOrder.status = "Refunded";
      updatedOrder.refunded = true;
      updatedOrder.delivery_status = "Cancelled";
      updatedOrder.refundId = refund.id;

      await updatedOrder.save();

      for (const cartItem of updatedOrder.cartItems) {
        await updateVariantStockBySku(
          cartItem.sku,
          cartItem.quantity,
          "increment"
        );
        await updateProductAndVariantSold(
          cartItem.sku,
          cartItem.quantity,
          "decrement"
        );
      }
    }

    if (newDeliveryStatus === "Dispatched") {
      const emailSubject = `Dispatching order no. ${updatedOrder._id
        .toString()
        .slice(-5)}`;
      const hasFreeShipping = updatedOrder.cartItems.some(
        (item: CartItem) => item.freeShipping
      );

      const mailOptions = {
        to: updatedOrder.delivery_email,
        from: process.env.GMAIL_AUTH_USER,
        subject: emailSubject,
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #D97706;"><strong>${
        updatedOrder.shipping.name
      }</strong>, your order has been dispatched!</h2>
      <p>We have forwarded your order to the carrier and it is on its way to you.</p>
      <h3 style="color: #D97706;">Order Recap</h3>
      <div style="border-top: 1px solid #D97706; margin-top: 10px; padding-top: 10px;">
        <h4 style="margin: 0;">Shipping Address</h4>
        <p style="margin: 5px 0;">
          <strong>${updatedOrder.shipping.name}</strong><br/>
          ${updatedOrder.shipping.address.line1}<br/>
          ${
            updatedOrder.shipping.address.line2
              ? `${updatedOrder.shipping.address.line2}<br/>`
              : ""
          }
          ${updatedOrder.shipping.address.city},${
          updatedOrder.shipping.address.state
            ? ` ${updatedOrder.shipping.address.state}`
            : ""
        } ${updatedOrder.shipping.address.postal_code}<br/>
          ${updatedOrder.shipping.address.country}
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
            ${updatedOrder.cartItems
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
                <td style="padding: 5px; border-bottom: 1px solid #eaeaea;">$${item.price.toFixed(
                  2
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
          <h3>Cash on Delivery: <strong>${
            updatedOrder.status === "succeeded"
              ? formatCurrency(0)
              : formatCurrency(updatedOrder.amount_captured / 100)
          }</strong></h3>
          <p>If you have any questions or concerns, please contact our support team.</p>
          <p>Thank you for shopping with us!</p>
        </div>    
      </div>
    `,
      };

      await transporter.sendMail(mailOptions);
    }

    revalidatePath(paths.admin());
    revalidatePath(paths.adminOrderShow());
    revalidatePath(paths.userOrderShowAll());
    revalidatePath(paths.orderSuccess(updatedOrder.success_token));
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

interface ProcessOrderFormState {
  error: string;
}

export async function processOrder(
  id: mongoose.Types.ObjectId,
  formState: ProcessOrderFormState,
  formData: FormData
): Promise<ProcessOrderFormState> {
  const { authorized, authError } = await validateUserSession();
  if (!authorized) {
    return {
      error: authError,
    };
  }

  const mutationResult = await handleDataMutation(
    async () => {
      const updatedOrder = await Order.findById(id);

      if (!updatedOrder) throw new Error("Order not found");

      const { delivery_status: deliveryStatus } = updatedOrder;

      if (deliveryStatus !== "Not Processed")
        throw new Error("This order cannot be edited");

      updatedOrder.delivery_status = "Processing";

      await updatedOrder.save();

      revalidatePath(paths.admin());
      revalidatePath(paths.adminOrderShow());
      revalidatePath(paths.userOrderShowAll());
      revalidatePath(paths.orderSuccess(updatedOrder.success_token));
    },
    "Something went wrong",
    false
  );

  return {
    error: mutationResult.error || "",
  };
}
