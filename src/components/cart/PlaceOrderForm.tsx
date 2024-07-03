"use client";

import { useFormState } from "react-dom";
import Form from "../ui/Form";
import * as actions from "@/actions";
import { useCartContext } from "@/app/contexts/CartContext";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import SetStepButtons from "./SetStepButtons";

interface PlaceOrderForm {
  onStepDecrement: () => void;
  currentStep: number;
}

export default function PlaceOrderForm({
  onStepDecrement,
  currentStep,
}: PlaceOrderForm) {
  const { cartItems, discountCoupon } = useCartContext();
  const [formState, action] = useFormState(
    actions.createPaymentSession.bind(null, cartItems, discountCoupon),
    {
      errors: {},
    }
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { data } = useSession();
  const userEmail = data?.user.email;
  return (
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
        <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
      ) : null}
      <div className="bg-zinc-200 py-4 px-3 flex flex-col text-center gap-2 text-lg mob-lg:text-base font-sans">
        <p>The delivery address is filled during payment.</p>
        <p>
          Click &quot;Place Order&quot; and you will be redirected securely to
          the payment gateway to complete your order.
        </p>
      </div>

      <SetStepButtons
        onStepDecrement={onStepDecrement}
        currentStep={currentStep}
      />
    </Form>
  );
}
