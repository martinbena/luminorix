"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { Order } from "@/models/Order";
import HeadingTertiary from "../ui/HeadingTertiary";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";

interface EditOrderFormProps {
  onCloseModal?: () => void;
  order: Order;
}

export default function EditOrderForm({
  onCloseModal,
  order,
}: EditOrderFormProps) {
  const {
    chargeId,
    payment_intent,
    status,
    shipping,
    delivery_status,
    delivery_email,
    delivery_telephone,
  } = order;
  const [formState, action] = useFormState(
    actions.editOrder.bind(null, order?._id),
    {
      errors: {},
      success: false,
    }
  );

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const readOnly =
    delivery_status !== "Processing" && delivery_status !== "Not Processed";
  const statusReadOnly =
    delivery_status === "Cancelled" || delivery_status === "Delivered";
  const currentStatusIndex =
    ORDER_STATUS_FILTER_OPTIONS.indexOf(delivery_status);

  useEffect(() => {
    firstInputRef.current?.focus();

    if (formState.success) {
      toast.success("Order was successfully edited");
      onCloseModal?.();
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState, onCloseModal]);

  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>Edit order no. {order._id.toString().slice(-5)}</Form.Title>
        <Form.InputGroup
          inputType="text"
          name={"edit-chargeID"}
          error={undefined}
          value={chargeId}
          isReadOnly
        >
          Charge ID
        </Form.InputGroup>
        <Form.InputGroup
          inputType="text"
          name={"edit-payment-intent"}
          error={undefined}
          value={payment_intent}
          isReadOnly
        >
          Payment intent
        </Form.InputGroup>
        <Form.InputGroup
          inputType="text"
          name={"edit-payment-status"}
          error={undefined}
          value={status}
          isReadOnly
        >
          Payment status
        </Form.InputGroup>
        <Form.InputGroup
          inputType="text"
          name={"telephone"}
          error={formState.errors.telephone}
          value={delivery_telephone}
          placeholder="+15554443333"
          inputRef={firstInputRef}
          isReadOnly={readOnly}
        >
          Delivery telephone
        </Form.InputGroup>
        <Form.InputGroup
          inputType="text"
          name={"email"}
          error={formState.errors.email}
          value={delivery_email}
          placeholder="john.doe@example.com"
          isReadOnly={readOnly}
        >
          Delivery e-mail
        </Form.InputGroup>
        <div className="flex flex-col gap-4">
          <HeadingTertiary>Delivery address</HeadingTertiary>
          <div className="grid gap-4 grid-cols-3 mob:grid-cols-2 mob-sm:grid-cols-1">
            <Form.InputGroup
              inputType="text"
              name={"name"}
              error={formState.errors.name}
              value={shipping.name}
              placeholder="John Doe"
              isReadOnly={readOnly}
            >
              Name
            </Form.InputGroup>
            <Form.InputGroup
              inputType="select"
              options={
                readOnly
                  ? [shipping.address.country]
                  : process.env.STRIPE_COUNTRY_CODES?.split(",")
              }
              name={"country"}
              error={formState.errors.country}
              value={shipping.address.country}
              placeholder="US"
              isReadOnly={readOnly}
            >
              Country
            </Form.InputGroup>
            <Form.InputGroup
              inputType="text"
              name={"city"}
              error={formState.errors.city}
              value={shipping.address.city}
              placeholder="Portland"
              isReadOnly={readOnly}
            >
              City
            </Form.InputGroup>
            <Form.InputGroup
              inputType="text"
              name={"street"}
              error={formState.errors.street}
              value={shipping.address.line1}
              placeholder="Maplewood Lane 1234"
              isReadOnly={readOnly}
            >
              Street
            </Form.InputGroup>
            <Form.InputGroup
              inputType="text"
              name={"postalCode"}
              error={formState.errors.postalCode}
              value={shipping.address.postal_code}
              placeholder="97218"
              isReadOnly={readOnly}
            >
              Postal code
            </Form.InputGroup>
          </div>
        </div>
        <Form.InputGroup
          inputType="select"
          name={"deliveryStatus"}
          error={formState.errors.deliveryStatus}
          options={
            statusReadOnly
              ? [delivery_status]
              : ORDER_STATUS_FILTER_OPTIONS.slice(currentStatusIndex)
          }
          value={delivery_status}
          placeholder="97218"
          isReadOnly={statusReadOnly}
        >
          Delivery status
        </Form.InputGroup>
        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between mob:flex-col gap-5">
          <Form.Button width="w-1/2 mob:w-full">Edit order</Form.Button>

          <Button onClick={onCloseModal} type="tertiary">
            Cancel
          </Button>
        </div>
      </Form>
    </Form.Container>
  );
}
