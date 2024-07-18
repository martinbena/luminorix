"use client";

import { useFormState } from "react-dom";
import Button from "../ui/Button";
import Form from "../ui/Form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DeleteItemState } from "@/actions/category";
import HeadingSecondary from "../ui/HeadingSecondary";

interface ConfirmDeleteProps {
  resourceName: string;
  onCloseModal?: () => void;
  onConfirm: () => Promise<DeleteItemState>;
}

export default function ConfirmDelete({
  resourceName,
  onCloseModal,
  onConfirm,
}: ConfirmDeleteProps) {
  const [storedName, setStoredName] = useState<string>("");
  const [formState, action] = useFormState(onConfirm, {
    error: "",
    success: false,
  });

  useEffect(() => {
    async function storeName() {
      const confirmedName = await Promise.resolve(resourceName);
      setStoredName(confirmedName);
    }
    storeName();
  }, [resourceName]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (formState.success) {
      toast.success(`${storedName} successfully deleted`);
      onCloseModal?.();
    }

    if (formState.error) {
      toast.error(formState.error);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [formState, onCloseModal, storedName]);

  return (
    <div className="flex flex-col gap-5 min-w-96 pb-8 px-12 pt-10 mob:px-6 mob:min-w-0 shadow-form">
      <HeadingSecondary>Delete {resourceName}</HeadingSecondary>

      <p className="text-base font-sans">
        Are you sure you want to delete <strong>{resourceName}</strong>{" "}
        permanently? This action cannot be undone.
      </p>

      <div className="flex items-center justify-end gap-4 mob-sm:justify-center">
        <Button type="tertiary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Form formAction={action}>
          <Form.Button width="w-full" type="secondary">
            Delete
          </Form.Button>
        </Form>
      </div>
    </div>
  );
}
