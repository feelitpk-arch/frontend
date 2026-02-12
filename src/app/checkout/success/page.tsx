import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="text-6xl">✓</div>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
        Order Placed Successfully!
      </h1>
      <p className="max-w-md text-sm text-neutral-600">
        Thank you for your order. We&apos;ve received your order and will begin
        processing it right away. You will receive an email confirmation shortly.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
        >
          Continue Shopping
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-700 transition hover:border-black hover:bg-neutral-50"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

