"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { Product } from "@/models/Product";
import HeadingTertiary from "../ui/HeadingTertiary";

interface AddEditProductFormProps {
  onCloseModal?: () => void;
  isEditSession?: boolean;
  product?: Product;
}

export default function AddEditProductForm({
  onCloseModal,
  isEditSession = false,
  product,
}: AddEditProductFormProps) {
  const formAction = isEditSession
    ? actions.editCategory.bind(null, product?._id)
    : actions.createCategory;

  const [formState, action] = useFormState(formAction, {
    errors: {},
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditSession) {
      firstInputRef.current?.focus();
    }

    if (formState.success) {
      toast.success(
        `Product was successfully ${isEditSession ? "edited" : "created"}`
      );
      onCloseModal?.();
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState, onCloseModal, isEditSession]);
  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>
          {isEditSession ? `Edit ${product?.title}` : "Add product"}
        </Form.Title>
        <Form.InputGroup
          inputType="text"
          name={isEditSession ? "edit-title" : "title"}
          placeholder="Rolex chronometer"
          error={formState.errors.title}
          value={product?.title}
          inputRef={firstInputRef}
        >
          Title
        </Form.InputGroup>
        <Form.InputGroup
          inputType="textarea"
          name={isEditSession ? "edit-description" : "description"}
          placeholder="Add a description of the product"
          error={formState.errors.title}
          value={product?.title}
          inputRef={firstInputRef}
        >
          Description
        </Form.InputGroup>
        <Form.InputGroup
          inputType="checkbox"
          name={isEditSession ? "edit-shipping" : "shipping"}
          placeholder="20"
          error={formState.errors.title}
          value={product?.title}
          inputRef={firstInputRef}
        >
          Free shipping
        </Form.InputGroup>

        <HeadingTertiary>Default variant</HeadingTertiary>

        <div className="grid grid-cols-3 gap-6">
          <Form.InputGroup
            inputType="text"
            name={isEditSession ? "edit-sku" : "sku"}
            placeholder="WA-01-01"
            error={formState.errors.title}
            value={product?.title}
            inputRef={firstInputRef}
          >
            SKU
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            name={isEditSession ? "edit-price" : "price"}
            placeholder="129.99"
            error={formState.errors.title}
            value={product?.title}
            inputRef={firstInputRef}
          >
            Price
          </Form.InputGroup>
          <Form.InputGroup
            inputType="number"
            name={isEditSession ? "edit-previous-price" : "previous-price"}
            placeholder="199.99"
            error={formState.errors.title}
            value={product?.title}
            inputRef={firstInputRef}
          >
            Previous price
          </Form.InputGroup>

          <Form.InputGroup
            inputType="number"
            name={isEditSession ? "edit-stock" : "stock"}
            placeholder="20"
            error={formState.errors.title}
            value={product?.title}
            inputRef={firstInputRef}
          >
            Stock
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name={isEditSession ? "edit-color" : "color"}
            placeholder="Gold"
            error={formState.errors.title}
            value={product?.title}
            inputRef={firstInputRef}
          >
            Color
          </Form.InputGroup>

          <Form.InputGroup
            inputType="text"
            name={isEditSession ? "edit-size" : "size"}
            placeholder="32"
            error={formState.errors.title}
            value={product?.title}
            inputRef={firstInputRef}
          >
            Size
          </Form.InputGroup>
        </div>
        <Form.ImagePicker name="image" />

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
