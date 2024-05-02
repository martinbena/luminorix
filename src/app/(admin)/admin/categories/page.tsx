"use client";

import ButtonIcon from "@/components/ButtonIcon";
import FormButton from "@/components/FormButton";
import FormInputGroup from "@/components/FormInputGroup";
import HeadingSecondary from "@/components/HeadingSecondary";
import { PiDotsThreeVerticalLight } from "react-icons/pi";

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
            className="rounded-md border border-zinc-200 font-sans mt-16 max-w-2xl w-full overflow-hidden"
          >
            <header
              role="row"
              className="bg-amber-100 uppercase font-semibold tracking-wide border-b border-zinc-100 px-6 py-4 grid grid-cols-1 gap-x-6 items-center"
            >
              Categories
            </header>
            <section className="mt-2">
              <div
                role="row"
                className="grid grid-cols-[1fr_max-content] gap-6 items-center px-6 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100"
              >
                <div className="font-semibold tracking-wide">Jewelry</div>
                <div>
                  <ButtonIcon variant="small" onClick={() => {}}>
                    <PiDotsThreeVerticalLight />
                  </ButtonIcon>
                </div>
              </div>
              <div
                role="row"
                className="grid grid-cols-[1fr_max-content] gap-6 items-center px-6 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100"
              >
                <div className="font-semibold tracking-wide">Watches</div>
                <div>
                  <ButtonIcon variant="small" onClick={() => {}}>
                    <PiDotsThreeVerticalLight />
                  </ButtonIcon>
                </div>
              </div>
            </section>
            {/* <footer className="p-3 bg-zinc-100 flex justify-center"></footer> */}
          </div>
        </div>
      </section>
    </>
  );
}
