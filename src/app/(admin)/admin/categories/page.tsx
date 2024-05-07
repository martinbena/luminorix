"use client";

import HeadingSecondary from "@/components/ui/HeadingSecondary";
import Popover from "@/components/ui/Popover";
import { useFormState } from "react-dom";
import * as actions from "@/actions";
import {
  PiDotsThreeVerticalLight,
  PiPencilSimpleLineThin,
  PiTrashThin,
} from "react-icons/pi";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import Form from "@/components/ui/Form";

export default function AdminCategoriesPage() {
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
    <>
      <HeadingSecondary>Manage all categories</HeadingSecondary>
      <section className="mt-12 py-8">
        <div className="flex justify-center">
          <div className="px-6 py-8 rounded-md shadow-form max-w-2xl w-full">
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
          </div>
        </div>

        <div className="max-w-4xl flex justify-center mx-auto">
          <div
            role="table"
            className="rounded-md border border-zinc-200 font-sans mt-16 max-w-2xl w-full "
          >
            <header
              role="row"
              className="bg-amber-100 rounded-t-md uppercase font-semibold tracking-wide border-b border-zinc-100 px-6 py-4 grid grid-cols-1 gap-x-6 items-center"
            >
              Categories
            </header>
            <section className="mt-2">
              <div
                role="row"
                className="grid grid-cols-[1fr_max-content] gap-6 items-center px-6 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100"
              >
                <div className="font-semibold tracking-wide">Jewelry</div>
                <Popover>
                  <Popover.Button>
                    <PiDotsThreeVerticalLight className="w-8 h-8" />
                  </Popover.Button>
                  <Popover.Content>
                    <Popover.Row icon={<PiPencilSimpleLineThin />}>
                      Edit
                    </Popover.Row>
                    <Popover.Row icon={<PiTrashThin />}>Delete</Popover.Row>
                  </Popover.Content>
                </Popover>
              </div>
              <div
                role="row"
                className="grid grid-cols-[1fr_max-content] gap-6 items-center px-6 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100"
              >
                <div className="font-semibold tracking-wide">Watches</div>
                <Popover>
                  <Popover.Button>
                    <PiDotsThreeVerticalLight className="w-8 h-8" />
                  </Popover.Button>
                  <Popover.Content>
                    <Popover.Row icon={<PiPencilSimpleLineThin />}>
                      Edit
                    </Popover.Row>
                    <Popover.Row icon={<PiTrashThin />}>Delete</Popover.Row>
                  </Popover.Content>
                </Popover>
              </div>
            </section>
            {/* <footer className="p-3 bg-zinc-100 flex justify-center"></footer> */}
          </div>
        </div>
      </section>
    </>
  );
}
