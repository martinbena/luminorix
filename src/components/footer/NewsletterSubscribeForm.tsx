"use client";

import * as actions from "@/actions";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import Form from "../ui/Form";

export default function NewsletterSubmitForm() {
  const [formState, action] = useFormState(actions.newsletterSubscribe, {
    errors: {},
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      toast.success("Newsletter successfully subscribed");
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState]);

  return (
    <Form formAction={action} formRef={formRef}>
      <Form.InputGroup
        name="newsletter-email"
        placeholder="Enter email address"
        inputType="email"
        error={formState.errors.email}
      />
      <div className="-mt-4">
        <Form.Button width="w-full">Subscribe</Form.Button>
      </div>
    </Form>
  );
}
