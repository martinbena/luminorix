import Button from "../Button";
import HeadingTertiary from "../HeadingTertiary";

export default function Newsletter() {
  return (
    <div className="flex flex-col gap-6">
      <HeadingTertiary>Newsletter</HeadingTertiary>
      <form className="flex flex-col gap-4" action="">
        <input
          type="text"
          placeholder="Enter email address"
          className="border-2 border-zinc-300 w-96 px-4 py-1"
        />
        <Button type="primary" beforeBackground="before:bg-white">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
