"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { Category } from "@/models/Category";

interface AddEditCategoryFormProps {
  onCloseModal?: () => void;
  isEditSession?: boolean;
  category?: Category;
}

export default function AddEditCategoryForm({
  onCloseModal,
  isEditSession = false,
  category,
}: AddEditCategoryFormProps) {
  const formAction = isEditSession
    ? actions.editCategory.bind(null, category?._id)
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
        `Category was successfully ${isEditSession ? "edited" : "created"}`
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
          {isEditSession ? `Edit ${category?.title}` : "Add category"}
        </Form.Title>
        <Form.InputGroup
          inputType="text"
          name={isEditSession ? "edit-title" : "title"}
          placeholder="Women's fashion"
          error={formState.errors.title}
          value={category?.title}
          inputRef={firstInputRef}
        >
          Category title
        </Form.InputGroup>
        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between">
          <Form.Button width="w-1/2">
            {isEditSession ? "Edit" : "Create"} category
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
