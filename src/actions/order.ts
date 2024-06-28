"use server";

import { CartItem } from "@/app/contexts/CartContext";
import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import { getProductVariantBySku } from "@/db/queries/product";
import { getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { z } from "zod";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const checkContactDetailsSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: "Please enter a correct e-mail address",
  }),
  telephone: z.string().regex(/^\+[1-9]{1}[0-9]{1,3}[0-9\s().-]{7,14}$/, {
    message: "Please enter a correct telephone number with your area code",
  }),
});

interface CheckContactDetailsFormState {
  errors: {
    email?: string[];
    telephone?: string[];
    _form?: string[];
  };
}

export async function checkContactDetails(
  cartItems: CartItem[],
  formState: CheckContactDetailsFormState,
  formData: FormData
): Promise<CheckContactDetailsFormState> {
  const result = checkContactDetailsSchema.safeParse({
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
        const product = await getProductVariantBySku(item.sku);
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
      shipping_options: [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE }],
      shipping_address_collection: {
        allowed_countries: countryCodes,
      },
      // discounts: [{ coupon: couponCode }],
      customer_email: result.data.email,
    });

    // console.log(paymentSession);

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

  return {
    errors: {},
  };
}

// export async function POST(req) {
//   await dbConnect();
//   const { cartItems, couponCode } = await req.json();
//   // const user = await currentUser();
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const user = token?.user;

//   try {
//     const lineItems = await Promise.all(
//       cartItems.map(async (item) => {
//         const product = await Product.findById(item._id);
//         const unitAmount = product.price * 100;
//         return {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: product.title,
//               images: [product.images[0].secure_url],
//             },
//             unit_amount: unitAmount,
//           },
//           tax_rates: [process.env.STRIPE_TAX_RATE],
//           quantity: item.quantity,
//         };
//       })
//     );

//     const session = await stripe.checkout.sessions.create({
//       line_items: lineItems,
//       success_url: `${process.env.DOMAIN}/dashboard/user/stripe/success`,
//       client_reference_id: user._id,
//       mode: "payment",
//       payment_method_types: ["card"],
//       payment_intent_data: {
//         metadata: {
//           cartItems: JSON.stringify(cartItems),
//           userId: user._id,
//         },
//       },
//       shipping_options: [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE }],
//       shipping_address_collection: {
//         allowed_countries: ["AU", "CZ"],
//       },
//       discounts: [{ coupon: couponCode }],
//       customer_email: user.email,
//     });

//     return NextResponse.json(session);
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { error: "Server error. Please try again." },
//       { status: 500 }
//     );
//   }
// }
