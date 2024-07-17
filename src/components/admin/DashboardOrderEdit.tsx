"use client";

import * as actions from "@/actions";
import { Order } from "@/models/Order";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import Form from "../ui/Form";

interface DashboardOrderEditProps {
  order: Order;
}

export default function DashboardOrderEdit({ order }: DashboardOrderEditProps) {
  const [formState, action] = useFormState(
    actions.processOrder.bind(null, order?._id),
    {
      error: "",
    }
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.error) {
      toast.error(formState.error);
    }
  }, [formState]);

  return (
    <Form formAction={action} formRef={formRef}>
      <Form.Button type="small" width="w-full">
        Process
      </Form.Button>
    </Form>
  );
}
