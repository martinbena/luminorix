"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { ProductWithVariant } from "@/models/Product";
import HeadingTertiary from "../ui/HeadingTertiary";
import { Category } from "@/models/Category";
import Image from "next/image";

interface AddEditProductFormProps {
  onCloseModal?: () => void;
  isEditSession?: boolean;
  product?: ProductWithVariant;
  categories: Category[];
}

export default function AddEditProductForm({
  onCloseModal,
  isEditSession = false,
  product,
  categories,
}: AddEditProductFormProps) {
  const formAction = isEditSession
    ? actions.editProductWithVariant.bind(null, product?._id, product?.sku!)
    : actions.createProduct;

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
      setResetImage(true);
      toast.success(
        `Product was successfully ${isEditSession ? "edited" : "created"}`
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
          {isEditSession
            ? `Edit ${product?.title}${
                product?.color || product?.size ? "," : ""
              }${product?.color ? ` ${product.color}` : ""}${
                product?.size ? ` ${product.size}` : ""
              }`
            : "Add product"}
        </Form.Title>
        <Form.InputGroup
          inputType="select"
          name="category"
          error={formState.errors.category}
          value={product?.category.toString()}
          options={categories}
        >
          Category
        </Form.InputGroup>
        <Form.InputGroup
          inputType="text"
          name="title"
          placeholder="Rolex chronometer"
          error={formState.errors.title}
          value={product?.title}
          inputRef={firstInputRef}
        >
          Title
        </Form.InputGroup>
        <Form.InputGroup
          inputType="textarea"
          name="description"
          placeholder="Add a description of the product"
          error={formState.errors.description}
          value={product?.description}
        >
          Description
        </Form.InputGroup>

        <div className="flex justify-between items-center">
          <Form.InputGroup
            inputType="text"
            name="brand"
            placeholder="Rolex"
            error={formState.errors.brand}
            value={product?.brand}
          >
            Brand
          </Form.InputGroup>
          <Form.InputGroup
            inputType="checkbox"
            name="shipping"
            placeholder="20"
            error={undefined}
            checked={product?.freeShipping}
            optionalField={true}
          >
            Free shipping
          </Form.InputGroup>
        </div>

        <HeadingTertiary>
          {isEditSession ? "Selected" : "Default"} variant
        </HeadingTertiary>

        <div className="grid grid-cols-3 gap-6">
          <Form.InputGroup
            inputType="text"
            name="sku"
            placeholder="WA-01-01"
            error={undefined}
            isReadOnly={isEditSession}
            value={product?.sku}
          >
            SKU
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            step={0.01}
            name="price"
            placeholder="129.99"
            error={formState.errors.price}
            value={product?.price}
          >
            Price
          </Form.InputGroup>
          <Form.InputGroup
            inputType="number"
            step={0.01}
            name="previous-price"
            placeholder="199.99"
            error={formState.errors.previousPrice}
            value={product?.previousPrice}
            optionalField={true}
          >
            Previous price
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            name="stock"
            placeholder="20"
            error={formState.errors.stock}
            value={product?.stock}
          >
            Stock
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="color"
            placeholder="Gold"
            error={formState.errors.color}
            value={product?.color}
            optionalField={true}
          >
            Color
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name="size"
            placeholder="32"
            error={formState.errors.size}
            value={product?.size}
            optionalField={true}
          >
            Size
          </Form.InputGroup>
        </div>
        <div className="flex gap-6">
          <Form.ImagePicker
            name="image"
            optionalField={isEditSession ? true : false}
            error={formState.errors.image}
            isReset={resetImage}
          />

          {isEditSession && product ? (
            <div className="flex flex-col gap-2">
              <p>Current image</p>
              <div className="h-40 w-40 overflow-hidden">
                <Image
                  src={product?.image}
                  alt="Image of the product"
                  height={0}
                  width={0}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>
            </div>
          ) : null}
        </div>

        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between">
          <Form.Button width="w-1/2">
            {isEditSession ? "Edit" : "Create"} product
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
