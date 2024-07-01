"use server";

import { CartItem } from "@/app/contexts/CartContext";
import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import {
  getProductVariantsBySkus,
  hasFreeShipping,
} from "@/db/queries/product";
import { getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { z } from "zod";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentSessionSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: "Please enter a correct e-mail address",
  }),
  telephone: z.string().regex(/^\+[1-9]{1}[0-9]{1,3}[0-9\s().-]{7,14}$/, {
    message: "Please enter a correct telephone number with your area code",
  }),
});

interface CreatePaymentSessionFormState {
  errors: {
    email?: string[];
    telephone?: string[];
    _form?: string[];
  };
}

export async function createPaymentSession(
  cartItems: CartItem[],
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

    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const [product] = await getProductVariantsBySkus(item.sku);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: getProductVariantTitle(
                product.title,
                product.color,
                product.size
              ),
              images: [product.image],
            },
            unit_amount: product.price * 100,
          },
          // tax_rates: [process.env.STRIPE_TAX_RATE],
          quantity: item.quantity,
        };
      })
    );

    const freeShipping = await hasFreeShipping(
      cartItems.map((item) => item.sku)
    );

    const metadata = {
      cartItems: JSON.stringify(
        cartItems.map((item) => {
          return {
            sku: item.sku,
            quantity: item.quantity,
          };
        })
      ),
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
      // discounts: [{ coupon: couponCode }],
      customer_email: result.data.email,
    });

    redirect(paymentSession.url);
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
    return {
      errors: {
        _form: ["Something went wrong"],
      },
    };
  }
}
