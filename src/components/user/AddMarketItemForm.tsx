"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Product } from "@/models/Product";
import { PRODUCT_CONDITION_OPTIONS } from "@/lib/constants";

interface AddMarketItemFormProps {
  products: Product[];
}

export default function AddMarketItemForm({
  products,
}: AddMarketItemFormProps) {
  const [formState, action] = useFormState(actions.addMarketItem, {
    errors: {},
    success: false,
  });

  const [resetImage, setResetImage] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      setResetImage(true);
      toast.success("Market item was successfully listed");
      setTimeout(() => setResetImage(false), 100);
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState]);
  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>Add market item</Form.Title>
        <Form.InputGroup
          inputType="select"
          name="product"
          error={formState.errors.product}
          options={products}
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
          >
            Price
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            step={1}
            name="age"
            placeholder="1"
            error={formState.errors.age}
          >
            Product age (years)
          </Form.InputGroup>

          <Form.InputGroup
            inputType="select"
            name="condition"
            error={formState.errors.condition}
            options={PRODUCT_CONDITION_OPTIONS}
          >
            Condition
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="location"
            placeholder="Portland, USA"
            error={formState.errors.location}
          >
            Location (city, country)
          </Form.InputGroup>
        </div>
        <Form.InputGroup
          inputType="textarea"
          name="issues"
          placeholder="Describe any known issues or defects of your product..."
          error={formState.errors.issues}
          optionalField
        >
          Issues or defects
        </Form.InputGroup>
        <Form.ImagePicker
          name="image"
          error={formState.errors.image}
          isReset={resetImage}
        />

        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between">
          <Form.Button width="w-1/2 mob:w-full">List item</Form.Button>
        </div>
      </Form>
    </Form.Container>
  );
}
