"use client";

import { useFormState } from "react-dom";
import Form from "../ui/Form";
import StarRating from "./StarRating";
import { useEffect, useRef } from "react";
import * as actions from "@/actions";
import toast from "react-hot-toast";
import { UserRating } from "@/db/queries/user";

interface AddEditRatingFormProps {
  onCloseModal?: () => void;
  isEditSession?: boolean;
  rating?: UserRating;
  productSlug: string;
}

export default function AddEditRatingForm({
  onCloseModal,
  isEditSession = false,
  rating,
  productSlug,
}: AddEditRatingFormProps) {
  const formAction = isEditSession ? actions.editRating : actions.addRating;

  const [formState, action] = useFormState(formAction, {
    errors: {},
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditSession) {
      firstInputRef.current?.focus();
    }

    if (formState.success) {
      toast.success(
        `Rating was successfully ${isEditSession ? "edited" : "added"}`
      );
      onCloseModal?.();
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState, onCloseModal, isEditSession]);

  return (
    <Form.Container>
      {formState.success ? (
        <p>Thank you for your rating!</p>
      ) : (
        <Form formAction={action} formRef={formRef}>
          <Form.Title>{isEditSession ? "Edit" : "Leave"} a rating</Form.Title>
          <StarRating
            defaultValue={isEditSession ? rating?.review.rating ?? 0 : 0}
          />
          {formState.errors.rating ? (
            <Form.Error>{formState.errors.rating.join(" | ")}</Form.Error>
          ) : null}
          <Form.InputGroup
            inputType="textarea"
            name="comment"
            error={formState.errors.comment}
            optionalField
            textareaRef={firstInputRef}
            value={rating?.review.comment}
          >
            Optional review
          </Form.InputGroup>
          <input type="hidden" value={productSlug} name="product-slug" />
          {formState.errors._form ? (
            <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
          ) : null}
          {formState.errors.productSlug ? (
            <Form.Error>{formState.errors.productSlug.join(" | ")}</Form.Error>
          ) : null}
          <Form.Button>Submit</Form.Button>
        </Form>
      )}
    </Form.Container>
  );
}
