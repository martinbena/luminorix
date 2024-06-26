"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import UpdateItemQuantity from "@/components/cart/UpdateItemQuantity";
import Button from "@/components/ui/Button";
import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { cartItems, isCartLoading, getTotalCartPrice, getTotalCartQuantity } =
    useCartContext();
  const totalCartItemsQuantity = getTotalCartQuantity();
  const totalCartPrice = getTotalCartPrice();

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
      <div className="pt-10 max-w-6xl mx-auto">
        <section>
          <StepsContainer>
            <Step step={1} currentStep={currentStep}>
              <StepNumber>1</StepNumber>
              Cart
            </Step>

            <Step step={2} currentStep={currentStep}>
              <StepNumber>2</StepNumber> Contact Details
            </Step>
            <Step step={3} currentStep={currentStep}>
              <StepNumber>3</StepNumber> Payment
            </Step>
          </StepsContainer>
        </section>

        {isCartLoading ? (
          <p>Loading...</p>
        ) : cartItems.length ? (
          <section className="mt-16 grid grid-cols-[2fr_1fr] gap-8">
            <div>
              <div className="w-full bg-amber-200 py-2 font-sans text-center text-base mb-8">
                <p>Review Cart / Adjust Quantity</p>
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
                          <Link
                            className="hover:underline text-xl font-semibold"
                            href={paths.productShow(item.slug, item.sku)}
                          >
                            {composedTitle}
                          </Link>
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
              <div className="flex justify-between items-center mt-6">
                {currentStep > 1 ? (
                  <Button type="tertiary" onClick={() => handleStepDecrement()}>
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
                        <p>{composedTitle}</p>
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
                <div className="flex justify-between font-sans items-center">
                  <p className="text-base">
                    {" "}
                    {`Total ${totalCartItemsQuantity} ${
                      totalCartItemsQuantity > 1 ? "items" : "item"
                    }:`}
                  </p>
                  <span className="text-2xl font-medium">
                    {formatCurrency(totalCartPrice)}
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
