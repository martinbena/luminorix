"use client";

import { useFormState } from "react-dom";
import Form from "../ui/Form";
import StarRating from "./StarRating";
import { useEffect, useRef } from "react";
import * as actions from "@/actions";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function AddEditRating() {
  const formAction = actions.addRating;

  const [formState, action] = useFormState(formAction, {
    errors: {},
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const productSlug = pathname.split("/")[1];

  useEffect(() => {
    if (formState.success) {
      toast.success(`Your rating has been added!`);
    }
  }, [formState]);

  return (
    <Form.Container>
      {formState.success ? (
        <p>Thank you for your rating!</p>
      ) : (
        <Form formAction={action} formRef={formRef}>
          <Form.Title>Leave a rating</Form.Title>
          <StarRating />
          {formState.errors.rating ? (
            <Form.Error>{formState.errors.rating.join(" | ")}</Form.Error>
          ) : null}
          <Form.InputGroup
            inputType="textarea"
            name="comment"
            error={formState.errors.comment}
            optionalField
            inputRef={firstInputRef}
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
