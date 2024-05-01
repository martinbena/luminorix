import FormButton from "@/components/FormButton";
import FormInputGroup from "@/components/FormInputGroup";
import HeadingSecondary from "@/components/HeadingSecondary";

export default function AdminCategoriesPage() {
  return (
    <>
      <HeadingSecondary>Manage all categories</HeadingSecondary>
      <section className="mt-12 py-8">
        <div className="flex justify-center">
          <form
            className="[&>*:nth-child(1)]:mb-8 [&>*:nth-child(1)]:text-center px-6 py-8 rounded-md shadow-lg max-w-2xl w-full"
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
      </section>
    </>
  );
}
