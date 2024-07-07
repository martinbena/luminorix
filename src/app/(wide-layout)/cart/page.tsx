"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import ApplyDiscountForm from "@/components/cart/ApplyDiscountForm";
import CartItems from "@/components/cart/CartItems";
import CartSkeleton from "@/components/cart/CartSkeleton";
import EmptyCart from "@/components/cart/EmptyCart";
import PaymentMethod from "@/components/cart/PaymentMethod";
import PlaceOrderForm from "@/components/cart/PlaceOrderForm";
import SetStepButtons from "@/components/cart/SetStepButtons";
import StepIndicator from "@/components/cart/StepIndicator";
import TotalPrice from "@/components/cart/TotalPrice";
import { PropsWithChildren, useState } from "react";

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { cartItems, isCartLoading } = useCartContext();

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
    <div className="pt-10 max-w-6xl mx-auto text-zinc-800">
      <StepIndicator currentStep={currentStep} />

      {isCartLoading ? (
        <CartSkeleton />
      ) : cartItems.length ? (
        <section className="mt-16 grid grid-cols-[2fr_1fr] tab:grid-cols-1 gap-8">
          <div className="tab:order-2">
            <Headline>
              {currentStep === 1 && <span>Review Cart / Adjust Quantity</span>}
              {currentStep === 2 && <span>Payment Method</span>}
              {currentStep === 3 && <span>Contact Details</span>}
            </Headline>

            {currentStep === 1 && <CartItems />}
            {currentStep === 2 && <PaymentMethod />}
            {currentStep === 3 && (
              <PlaceOrderForm
                onStepDecrement={handleStepDecrement}
                currentStep={currentStep}
              />
            )}
            {currentStep !== 3 ? (
              <SetStepButtons
                onStepDecrement={handleStepDecrement}
                onStepIncrement={handleStepIncrement}
                currentStep={currentStep}
              />
            ) : null}
          </div>
          <div className="tab:order-1">
            <Headline>Order Summary</Headline>
            <CartItems type="summary" />
            <TotalPrice />
            <ApplyDiscountForm />
          </div>
        </section>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}

function Headline({ children }: PropsWithChildren) {
  return (
    <div className="w-full bg-amber-200 py-2 px-3 font-sans text-center text-base mb-8">
      <p>{children}</p>
    </div>
  );
}
