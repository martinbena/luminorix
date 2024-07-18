"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Product } from "@/models/Product";
import { PRODUCT_CONDITION_OPTIONS } from "@/lib/constants";
import { MarketItem } from "@/models/MarketItem";
import Image from "next/image";

interface AddEditMarketItemFormProps {
  onCloseModal?: () => void;
  isEditSession?: boolean;
  item?: MarketItem;
  products: Product[];
}

export default function AddEditMarketItemForm({
  onCloseModal,
  isEditSession = false,
  products,
  item,
}: AddEditMarketItemFormProps) {
  const formAction = isEditSession
    ? actions.editMarketItem.bind(null, item?._id)
    : actions.addMarketItem;

  const [formState, action] = useFormState(formAction, {
    errors: {},
    success: false,
  });

  const [resetImage, setResetImage] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditSession) {
      firstInputRef.current?.focus();
    }

    if (formState.success) {
      !isEditSession && setResetImage(true);
      toast.success("Market item was successfully listed");
      onCloseModal?.();
      !isEditSession && setTimeout(() => setResetImage(false), 100);
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState, isEditSession, onCloseModal]);

  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>{`${
          isEditSession ? "Edit" : "Add"
        } market item`}</Form.Title>
        <Form.InputGroup
          inputType="select"
          name="product"
          error={formState.errors.product}
          options={products}
          value={item?.product._id}
        >
          Product
        </Form.InputGroup>

        <div className="grid grid-cols-2 gap-6 mob-sm:grid-cols-1">
          <Form.InputGroup
            inputType="number"
            step={0.01}
            name="price"
            placeholder="129.99"
            error={formState.errors.price}
            inputRef={firstInputRef}
            value={item?.price}
          >
            Price
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            step={1}
            name="age"
            placeholder="1"
            error={formState.errors.age}
            value={item?.age}
          >
            Product age (years)
          </Form.InputGroup>

          <Form.InputGroup
            inputType="select"
            name="condition"
            error={formState.errors.condition}
            options={PRODUCT_CONDITION_OPTIONS}
            value={item?.condition}
          >
            Condition
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="location"
            placeholder="Portland, USA"
            error={formState.errors.location}
            value={item?.location}
          >
            Location (city, country)
          </Form.InputGroup>
        </div>
        <Form.InputGroup
          inputType="textarea"
          name="issues"
          placeholder="Describe any known issues or defects of your product..."
          error={formState.errors.issues}
          value={item?.issues}
          optionalField
        >
          Issues or defects
        </Form.InputGroup>

        <div className="flex gap-6 mob:flex-col">
          <Form.ImagePicker
            name="image"
            optionalField={isEditSession ? true : false}
            error={formState.errors.image}
            isReset={resetImage}
          />

          {isEditSession && item ? (
            <div className="flex flex-col gap-2">
              <p>Current image</p>
              <div className="h-40 w-40 overflow-hidden relative">
                <Image
                  src={item?.image}
                  alt="Image of the product"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>

        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between">
          <Form.Button width="w-1/2 mob:w-full">{`${
            isEditSession ? "Edit" : "List"
          } item`}</Form.Button>
        </div>
      </Form>
    </Form.Container>
  );
}
