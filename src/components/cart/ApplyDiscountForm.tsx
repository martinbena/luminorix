"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import { useFormState } from "react-dom";
import * as actions from "@/actions";
import Form from "../ui/Form";
import { useEffect } from "react";

export default function ApplyDiscountForm() {
  const { discountCoupon, handleDiscountCouponApply } = useCartContext();

  const [couponFormState, couponAction] = useFormState(
    actions.applyDiscountCoupon,
    {
      errors: {},
      coupon: undefined,
    }
  );

  useEffect(() => {
    if (couponFormState.coupon) {
      handleDiscountCouponApply(couponFormState.coupon);
    }
  }, [handleDiscountCouponApply, couponFormState.coupon]);

  if (discountCoupon) return null;

  return (
    <Form formAction={couponAction}>
      <Form.InputGroup
        name="coupon"
        error={couponFormState.errors?.coupon}
        inputType="text"
        placeholder="Enter coupon"
        optionalField
      >
        Discount coupon
      </Form.InputGroup>
      {couponFormState.errors._form ? (
        <Form.Error>{couponFormState.errors._form.join(" | ")}</Form.Error>
      ) : null}
      <Form.Button type="secondary">Apply</Form.Button>
    </Form>
  );
}
