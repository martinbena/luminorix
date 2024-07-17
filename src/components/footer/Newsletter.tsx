import HeadingTertiary from "../ui/HeadingTertiary";
import NewsletterSubmitForm from "./NewsletterSubscribeForm";

export default function Newsletter() {
  return (
    <div className="flex flex-col gap-6 mob-lg:order-1">
      <HeadingTertiary>Newsletter</HeadingTertiary>
      <NewsletterSubmitForm />
    </div>
  );
}
