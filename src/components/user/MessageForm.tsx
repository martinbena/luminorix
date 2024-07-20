"use client";

import * as actions from "@/actions";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import Form from "../ui/Form";
import { ObjectId } from "mongoose";

interface MessageFormProps {
  senderId: ObjectId | undefined;
  recipientId: ObjectId;
}

export default function MessageForm({
  senderId,
  recipientId,
}: MessageFormProps) {
  const [formState, action] = useFormState(
    actions.changePassword.bind(null, senderId?.toString()),
    {
      errors: {},
      success: false,
    }
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      toast.success("Message successfully sent");
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState]);

  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>Contact seller</Form.Title>
        {/* <p>
          {numResponded > 0 ? (
            <>
              {" "}
              <span className="font-semibold">{numResponded}</span>{" "}
              {`${numResponded === 1 ? "person" : " people"}`} responded to this
              sale
            </>
          ) : (
            <span className="font-medium">
              No one has responded to this sale yet. You can be the first
            </span>
          )}
        </p> */}
        {senderId ? (
          <>
            {" "}
            <Form.InputGroup
              name="message"
              inputType="textarea"
              error={formState.errors.oldPassword}
            >
              Message
            </Form.InputGroup>
            {formState.errors._form ? (
              <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
            ) : null}
            <div className="flex justify-between mob:flex-col gap-5">
              <Form.Button width="w-1/2 mob:w-full">Send message</Form.Button>
            </div>{" "}
          </>
        ) : (
          <p className="text-base text-center">
            You must be logged in to send a message
          </p>
        )}
      </Form>
    </Form.Container>
  );
}
