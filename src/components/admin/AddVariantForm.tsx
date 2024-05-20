"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { Product } from "@/models/Product";

interface AddEditProductFormProps {
  products: Product[];
}

export default function AddVariantForm({ products }: AddEditProductFormProps) {
  const [formState, action] = useFormState(actions.addVariantToProduct, {
    errors: {},
    success: false,
  });

  const [resetImage, setResetImage] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      setResetImage(true);
      toast.success("Product variant was successfully created");
      setTimeout(() => setResetImage(false), 100);
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState]);
  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>Add variant</Form.Title>
        <Form.InputGroup
          inputType="select"
          name="product"
          error={formState.errors.product}
          options={products}
        >
          Product
        </Form.InputGroup>

        <div className="grid grid-cols-3 gap-6 mob:grid-cols-2 mob:gap-3">
          <Form.InputGroup
            inputType="text"
            name="sku"
            placeholder="WA-01-01"
            error={formState.errors.sku}
          >
            SKU
          </Form.InputGroup>

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
            step={0.01}
            name="previous-price"
            placeholder="199.99"
            error={formState.errors.previousPrice}
            optionalField={true}
          >
            Previous price
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            name="stock"
            placeholder="20"
            error={formState.errors.stock}
          >
            Stock
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="color"
            placeholder="Gold"
            error={formState.errors.color}
            optionalField={true}
          >
            Color
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="size"
            placeholder="32"
            error={formState.errors.size}
            optionalField={true}
          >
            Size
          </Form.InputGroup>
        </div>
        <Form.ImagePicker
          name="image"
          error={formState.errors.image}
          isReset={resetImage}
        />

        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between">
          <Form.Button width="w-1/2 mob:w-full">Add variant</Form.Button>
        </div>
      </Form>
    </Form.Container>
  );
}
