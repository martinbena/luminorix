"use client";

import * as actions from "@/actions";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import Form from "../ui/Form";
import { ExtendedUser } from "../../../next-auth";

interface ChangePasswordFormProps {
  user?: ExtendedUser;
  isGoogleUser: boolean | undefined;
}

export default function ChangePasswordForm({
  user,
  isGoogleUser,
}: ChangePasswordFormProps) {
  const [formState, action] = useFormState(
    actions.changePassword.bind(null, user?._id.toString()),
    {
      errors: {},
      success: false,
    }
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      toast.success("Password successfully changed");
    }

    if (Object.keys(formState.errors).length === 0) {
      formRef.current?.reset();
    }
  }, [formState]);

  return (
    <Form.Container>
      <Form formAction={action} formRef={formRef}>
        <Form.Title>Change password</Form.Title>
        <Form.InputGroup
          name="old-password"
          inputType="password"
          error={formState.errors.oldPassword}
          isReadOnly={isGoogleUser}
        >
          Current password
        </Form.InputGroup>
        <Form.InputGroup
          name="new-password"
          inputType="password"
          error={formState.errors.newPassword}
          isReadOnly={isGoogleUser}
        >
          New Password
        </Form.InputGroup>
        <Form.InputGroup
          name="new-password-confirm"
          inputType="password"
          error={formState.errors.newPasswordConfirm}
          isReadOnly={isGoogleUser}
        >
          Confirm new password
        </Form.InputGroup>
        {formState.errors._form ? (
          <Form.Error>{formState.errors._form.join(" | ")}</Form.Error>
        ) : null}
        <div className="flex justify-between mob:flex-col gap-5">
          <Form.Button width="w-1/2 mob:w-full" isDisabled={isGoogleUser}>
            Change password
          </Form.Button>
        </div>
      </Form>
    </Form.Container>
  );
}
