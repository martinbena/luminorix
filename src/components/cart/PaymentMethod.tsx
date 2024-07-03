export default function PaymentMethod() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-3xl">🔒 💳</p>
      <div className="bg-zinc-200 py-4 px-3 flex flex-col text-center gap-2 text-lg mob-lg:text-base font-sans">
        <p>We currently only accept card payments.</p>
        <p>
          All orders that do not include at least one free shipping item are
          subject to a flat $5 shipping fee.
        </p>
      </div>
    </div>
  );
}
