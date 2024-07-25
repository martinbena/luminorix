"use client";

import * as actions from "@/actions";
import { ObjectId } from "mongoose";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import Form from "../ui/Form";
import { useSession } from "next-auth/react";
import MessageFormSkeleton from "./MessageFormSkeleton";

interface MessageFormProps {
  recipientId: ObjectId;
  marketItemId: ObjectId;
}

export default function MessageForm({
  recipientId,
  marketItemId,
}: MessageFormProps) {
  const session = useSession();
  const [formState, action] = useFormState(
    actions.sendMessage.bind(null, recipientId, marketItemId),
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
    <div className="py-8 bg-zinc-100 mob-lg:bg-white mob-lg:mt-0 mt-4 flex justify-center">
      {session.status === "loading" ? (
        <MessageFormSkeleton />
      ) : (
        <Form.Container>
          <Form formAction={action} formRef={formRef}>
            <Form.Title>Contact seller</Form.Title>
            {session && session.data?.user && !formState.success ? (
              <>
                <p className="text-xs flex items-center">
                  <span className="text-amber-500 text-4xl leading-none">
                    *
                  </span>
                  Your name and e-mail address will be provided to the seller
                  from your account information
                </p>{" "}
                <Form.InputGroup
                  name="contact-phone"
                  inputType="tel"
                  error={formState.errors.telephone}
                  optionalField
                  placeholder="+15554443333"
                >
                  Telephone
                </Form.InputGroup>
                <Form.InputGroup
                  name="message"
                  inputType="textarea"
                  error={formState.errors.message}
                >
                  Message
                </Form.InputGroup>
                {formState.errors._form ? (
                  <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
                ) : null}
                <div className="flex justify-between mob:flex-col gap-5">
                  <Form.Button width="w-1/2 mob:w-full">
                    Send message
                  </Form.Button>
                </div>{" "}
              </>
            ) : formState.success ? (
              <p className="text-base text-center text-green-500">
                Your message has been sent successfully
              </p>
            ) : (
              <p className="text-base text-center">
                You must be logged in to send a message
              </p>
            )}
          </Form>
        </Form.Container>
      )}
    </div>
  );
}
