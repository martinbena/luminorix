"use client";

import * as actions from "@/actions";
import { useFormState } from "react-dom";
import Form from "../ui/Form";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function AddCategoryForm() {
  const [formState, action] = useFormState(actions.createCategory, {
    errors: {},
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      toast.success("Category was successfully created");
      formRef.current?.reset();
    }
  }, [formState.success]);
  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>Add category</Form.Title>
        <Form.InputGroup
          inputType="text"
          name="title"
          placeholder="Women's fashion"
          error={formState.errors.title}
        >
          Category title
        </Form.InputGroup>
        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <Form.Button width="w-1/2">Create category</Form.Button>
      </Form>
    </Form.Container>
  );
}
