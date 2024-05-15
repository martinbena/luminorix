"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { Product } from "@/models/Product";

interface AddEditProductFormProps {
  onCloseModal?: () => void;
  isEditSession?: boolean;
  product?: Product;
  products: Product[];
}

export default function AddVariantForm({
  onCloseModal,
  isEditSession = false,
  product,
  products,
}: AddEditProductFormProps) {
  const formAction = isEditSession
    ? actions.editCategory.bind(null, product?._id)
    : actions.createProduct;

  const [formState, action] = useFormState(actions.addVariantToProduct, {
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
      setResetImage(true);
      toast.success(
        `Product variant was successfully ${
          isEditSession ? "edited" : "created"
        }`
      );
      onCloseModal?.();
      setTimeout(() => setResetImage(false), 100);
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState, onCloseModal, isEditSession]);
  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>
          {isEditSession ? `Edit ${product?.title}` : "Add variant"}
        </Form.Title>
        <Form.InputGroup
          inputType="select"
          name="product"
          error={formState.errors.product}
          value={product?.title}
          options={products}
        >
          Product
        </Form.InputGroup>

        <div className="grid grid-cols-3 gap-6">
          <Form.InputGroup
            inputType="text"
            name="sku"
            placeholder="WA-01-01"
            error={formState.errors.sku}
            value={product?.title}
          >
            SKU
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            step={0.01}
            name="price"
            placeholder="129.99"
            error={formState.errors.price}
            value={product?.title}
          >
            Price
          </Form.InputGroup>
          <Form.InputGroup
            inputType="number"
            step={0.01}
            name="previous-price"
            placeholder="199.99"
            error={formState.errors.previousPrice}
            value={product?.title}
            optionalField={true}
          >
            Previous price
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            name="stock"
            placeholder="20"
            error={formState.errors.stock}
            value={product?.title}
          >
            Stock
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="color"
            placeholder="Gold"
            error={formState.errors.color}
            value={product?.title}
            optionalField={true}
          >
            Color
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="size"
            placeholder="32"
            error={formState.errors.size}
            value={product?.title}
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
          <Form.Button width="w-1/2">
            {isEditSession ? "Edit" : "Add"} variant
          </Form.Button>
          {isEditSession ? (
            <Button onClick={onCloseModal} type="tertiary">
              Cancel
            </Button>
          ) : null}
        </div>
      </Form>
    </Form.Container>
  );
}
