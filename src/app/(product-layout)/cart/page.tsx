"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import CartSkeleton from "@/components/cart/CartSkeleton";
import UpdateItemQuantity from "@/components/cart/UpdateItemQuantity";
import Button from "@/components/ui/Button";
import Form from "@/components/ui/Form";
import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, ReactNode, useRef, useState } from "react";
import * as actions from "@/actions";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { SHIPPING_RATE } from "@/lib/constants";

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const {
    cartItems,
    isCartLoading,
    getTotalCartPrice,
    getTotalCartQuantity,
    getShippingStatus,
  } = useCartContext();
  const totalCartItemsQuantity = getTotalCartQuantity();
  const totalCartPrice = getTotalCartPrice();
  const isShippingFree = getShippingStatus();

  const [formState, action] = useFormState(
    actions.checkContactDetails.bind(null, cartItems),
    {
      errors: {},
    }
  );
  const formRef = useRef<HTMLFormElement>(null);

  const { data } = useSession();
  const userEmail = data?.user.email;

  function handleStepIncrement() {
    if (currentStep < 3) {
      setCurrentStep((step) => step + 1);
    }
    return;
  }

  function handleStepDecrement() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
    return;
  }

  return (
    <>
      <div className="pt-10 max-w-6xl mx-auto text-zinc-800">
        <section>
          <StepsContainer>
            <Step step={1} currentStep={currentStep}>
              <StepNumber>1</StepNumber>
              Cart
            </Step>

            <Step step={2} currentStep={currentStep}>
              <StepNumber>2</StepNumber> Payment Method
            </Step>
            <Step step={3} currentStep={currentStep}>
              <StepNumber>3</StepNumber> Contact Details
            </Step>
          </StepsContainer>
        </section>

        {isCartLoading ? (
          <CartSkeleton />
        ) : cartItems.length ? (
          <section className="mt-16 grid grid-cols-[2fr_1fr] gap-8">
            <div>
              <div className="w-full bg-amber-200 py-2 font-sans text-center text-base mb-8">
                <p>
                  {currentStep === 1 && (
                    <span>Review Cart / Adjust Quantity</span>
                  )}
                  {currentStep === 2 && <span>Payment Method</span>}
                  {currentStep === 3 && <span>Contact Details</span>}
                </p>
              </div>
              {currentStep === 1 && (
                <ul className="flex flex-col gap-4">
                  {cartItems.map((item) => {
                    const composedTitle = getProductVariantTitle(
                      item.title,
                      item.color,
                      item.size
                    );
                    return (
                      <li
                        key={item.sku}
                        className="flex gap-6 border border-zinc-300 rounded-md p-2"
                      >
                        <div className="relative aspect-square w-48">
                          <Image
                            src={item.image}
                            alt={composedTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="hover:underline text-xl font-semibold">
                              <Link
                                href={paths.productShow(item.slug, item.sku)}
                              >
                                {composedTitle}
                              </Link>
                            </h3>

                            <p className="mt-7 font-sans text-lg">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <UpdateItemQuantity product={item} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {currentStep === 2 && (
                <div className="flex flex-col gap-8">
                  <p className="text-center text-3xl">🔒 💳</p>
                  <div className="bg-zinc-200 py-4 flex flex-col text-center gap-2 text-lg font-sans">
                    <p>We currently only accept card payments.</p>
                    <p>
                      All orders that do not include at least one free shipping
                      item are subject to a flat $5 shipping fee.
                    </p>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <Form formAction={action} formRef={formRef}>
                  <Form.InputGroup
                    name="email"
                    inputType="email"
                    placeholder="john.smith@example.com"
                    error={formState?.errors?.email}
                    value={userEmail || ""}
                  >
                    Email
                  </Form.InputGroup>
                  <Form.InputGroup
                    name="telephone"
                    inputType="tel"
                    placeholder="+15555555555"
                    error={formState?.errors?.telephone}
                  >
                    Telephone
                  </Form.InputGroup>
                  {formState.errors._form ? (
                    <Form.Error>
                      {formState.errors._form.join(" | ")}
                    </Form.Error>
                  ) : null}
                  <div className="bg-zinc-200 py-4 flex flex-col text-center gap-2 text-lg">
                    <p>The delivery address is filled during payment.</p>
                    <p>
                      Click &quot;Place Order&quot; and you will be redirected
                      securely to the payment gateway to complete your order.
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <Button
                      type="tertiary"
                      onClick={() => handleStepDecrement()}
                    >
                      Previous step
                    </Button>

                    <Form.Button>Place order</Form.Button>
                  </div>
                </Form>
              )}
              {currentStep !== 3 && (
                <div className="flex justify-between items-center mt-6">
                  {currentStep > 1 ? (
                    <Button
                      type="tertiary"
                      onClick={() => handleStepDecrement()}
                    >
                      Previous step
                    </Button>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                  {currentStep < 3 ? (
                    <Button
                      type="secondary"
                      onClick={() => handleStepIncrement()}
                    >
                      Next step
                    </Button>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="w-full bg-amber-200 py-2 font-sans text-center text-base mb-8">
                <p>Order Summary</p>
              </div>
              <ul className="flex flex-col gap-4">
                {cartItems.map((item) => {
                  const composedTitle = getProductVariantTitle(
                    item.title,
                    item.color,
                    item.size
                  );
                  return (
                    <li
                      key={item.sku}
                      className="flex gap-6 border border-zinc-300 rounded-md p-2"
                    >
                      <div className="relative aspect-square w-16">
                        <Image
                          src={item.image}
                          alt={composedTitle}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-col justify-between flex-1">
                        <h4>{composedTitle}</h4>
                        <div className="flex items-center justify-between">
                          <p className="font-sans text-base">
                            {formatCurrency(item.price)}
                          </p>
                          <p className="text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
                <div className="flex items-center justify-between font-sans">
                  <p>Shipping:</p>{" "}
                  <p className="text-lg">
                    {formatCurrency(isShippingFree ? 0 : SHIPPING_RATE)}
                  </p>
                </div>
                <div className="flex justify-between font-sans items-center">
                  <p className="text-base">
                    {" "}
                    {`Total ${totalCartItemsQuantity} ${
                      totalCartItemsQuantity > 1 ? "items" : "item"
                    }:`}
                  </p>
                  <span className="text-2xl font-medium">
                    {formatCurrency(
                      isShippingFree
                        ? totalCartPrice
                        : totalCartPrice + SHIPPING_RATE
                    )}
                  </span>
                </div>
              </ul>
            </div>
          </section>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center mt-24">
            <p className="text-lg font-sans">
              Your cart <b>is empty</b>
            </p>
            <Button type="secondary" href={paths.productShowAll()}>
              Continue shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function StepsContainer({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-3 justify-items-center font-sans font-medium text-lg">
      {children}
    </div>
  );
}

interface StepProps {
  children: ReactNode;
  step: number;
  currentStep: number;
}

function Step({ children, step, currentStep }: StepProps) {
  return (
    <div
      className={`${
        step <= currentStep ? "bg-amber-500" : "bg-amber-400"
      } flex w-full py-4 justify-center items-center gap-3 border-r border-amber-600 transition-colors duration-300 ease-out`}
    >
      {children}
    </div>
  );
}

function StepNumber({ children }: PropsWithChildren) {
  return (
    <span className="bg-amber-200 h-8 w-8 rounded-full flex justify-center items-center">
      {children}
    </span>
  );
}
