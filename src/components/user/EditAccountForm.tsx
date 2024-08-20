"use client";

import * as actions from "@/actions";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import Form from "../ui/Form";
import { ExtendedUser } from "../../../next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { HiUser } from "react-icons/hi";

interface EditAccountFormProps {
  user?: ExtendedUser;
  isGoogleUser: boolean | undefined;
}

export default function EditAccountForm({
  user,
  isGoogleUser,
}: EditAccountFormProps) {
  const { data, update } = useSession();
  const [formState, action] = useFormState(
    actions.editAccount.bind(null, user?._id.toString()),
    {
      errors: {},
      success: false,
      updatedUser: {
        name: "",
        email: "",
        image: "",
      },
    }
  );
  const [updateSession, setUpdateSession] = useState<boolean>(false);
  const [resetImage, setResetImage] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const updateUserSession = useCallback(() => {
    update({
      ...data?.user,
      name: formState.updatedUser?.name,
      email: formState.updatedUser?.email,
      image: formState.updatedUser?.image,
    });
  }, [data?.user, formState.updatedUser, update]);

  useEffect(() => {
    if (formState.success) {
      setResetImage(true);
      toast.success("Account settings successfully edited");
      setUpdateSession(true);
      setTimeout(() => setResetImage(false), 100);
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState]);

  useEffect(() => {
    if (updateSession) {
      updateUserSession();
      setUpdateSession(false);
    }
  }, [updateSession, updateUserSession]);
  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.InputGroup
          name="name"
          inputType="text"
          error={formState.errors.name}
          isReadOnly={isGoogleUser}
          value={user?.name ?? undefined}
        >
          Full name
        </Form.InputGroup>
        <Form.InputGroup
          name="email"
          inputType="email"
          error={formState.errors.email}
          isReadOnly={isGoogleUser}
          value={user?.email ?? undefined}
        >
          E-mail
        </Form.InputGroup>
        <div className="flex justify-between gap-8 mob:flex-col">
          <div className="flex flex-col gap-2">
            <p>Current image</p>
            <div className="aspect-square relative w-40 h-40">
              {user?.image ? (
                <Image
                  src={user?.image}
                  alt={`Image of ${user?.name}`}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              ) : (
                <HiUser className="w-20 h-20 mob:w-7 mob:h-7 text-zinc-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>

          <Form.ImagePicker
            name="image"
            error={formState.errors.image}
            optionalField
            isReset={resetImage}
            isDisabled={isGoogleUser}
          />
        </div>

        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between mob:flex-col gap-5">
          <Form.Button width="w-1/2 mob:w-full" isDisabled={isGoogleUser}>
            Edit account
          </Form.Button>
        </div>
      </Form>
    </Form.Container>
  );
}
