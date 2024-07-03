"use server";

import { CartItem, DiscountCoupon } from "@/app/contexts/CartContext";
import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import {
  getProductVariantsBySkus,
  hasFreeShipping,
} from "@/db/queries/product";
import { getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import { Category } from "@/models/Category";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { CartSession } from "@/models/Order";

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
  const result = applyDiscountCouponSchema.safeParse({
    coupon: formData.get("coupon"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const coupons = await stripe.promotionCodes.list({
      code: result.data.coupon,
      active: true,
    });

    if (coupons.data.length === 0) {
      throw new Error("Promotion code not found");
    }
    const coupon = coupons.data[0];
    return {
      errors: {},
      coupon: JSON.parse(JSON.stringify(coupon)),
    };
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error?.message],
        },
      };
    }
    return {
      errors: {
        _form: ["Something went wrong"],
      },
    };
  }
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
  const result = createPaymentSessionSchema.safeParse({
    email: formData.get("email"),
    telephone: formData.get("telephone"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  if (!cartItems.length) {
    return {
      errors: {
        _form: ["Please provide cart items before placing order"],
      },
    };
  }

  try {
    await ConnectDB();
    const session = await auth();
    const userId = session?.user._id;
    const cartSessionId = uuidv4();

    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const [product] = await getProductVariantsBySkus(item.sku);
        const composedTitle = getProductVariantTitle(
          product.title,
          product.color,
          product.size
        );
        if (item.stock > product.stock) {
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
      success_url: `${process.env.BASE_URL}${paths.home()}`,
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
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error?.message],
        },
      };
    }
    console.log(error);
    return {
      errors: {
        _form: ["Something went wrong"],
      },
    };
  }
}
