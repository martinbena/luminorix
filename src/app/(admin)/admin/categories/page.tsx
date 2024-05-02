"use client";

import FormButton from "@/components/ui/FormButton";
import FormInputGroup from "@/components/ui/FormInputGroup";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import Popover from "@/components/ui/Popover";
import {
  PiDotsThreeVerticalLight,
  PiPencilSimpleLineThin,
  PiTrashThin,
} from "react-icons/pi";

export default function AdminCategoriesPage() {
  return (
    <>
      <HeadingSecondary>Manage all categories</HeadingSecondary>
      <section className="mt-12 py-8">
        <div className="flex justify-center">
          <form
            className="[&>*:nth-child(1)]:mb-8 [&>*:nth-child(1)]:text-center px-6 py-8 rounded-md shadow-md max-w-2xl w-full"
            action=""
          >
            <HeadingSecondary>Add category</HeadingSecondary>
            <FormInputGroup
              inputType="text"
              name="title"
              placeholder="Women's fashion"
              error={undefined}
            >
              Category title
            </FormInputGroup>
            <div className="mt-8 text-center child:w-full w-1/2">
              <FormButton>Create category</FormButton>
            </div>
          </form>
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
