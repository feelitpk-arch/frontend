import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Feel It | Customer Support",
  description:
    "Reach out to Feel It for order questions, fragrance guidance, or stockist inquiries. We're here to help Monday-Saturday, 11am-8pm PKT.",
  keywords: "contact Feel It, customer support, perfume help, fragrance questions, order support",
  openGraph: {
    title: "Contact Us | Feel It",
    description: "Reach out to Feel It for order questions, fragrance guidance, or stockist inquiries.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-4">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl tracking-wide text-neutral-900">
          Contact Us
        </h1>
        <p className="text-sm text-neutral-600">
          We&apos;re here to help with product questions, order support, and
          fragrance recommendations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 text-sm text-neutral-700">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Support hours
          </p>
          <p>Monday – Saturday, 11am to 8pm (PKT)</p>
          <p className="text-xs text-neutral-500">
            We aim to respond to all messages within 24 business hours.
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Email
            </p>
            <p>support@feelit.test</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              WhatsApp
            </p>
            <p>+92 300 0000000</p>
          </div>
        </div>

        <form className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm shadow-black/5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700">
                Full name
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-200 px-3 py-2 text-xs outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-full border border-neutral-200 px-3 py-2 text-xs outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              Subject
            </label>
            <input
              type="text"
              className="w-full rounded-full border border-neutral-200 px-3 py-2 text-xs outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}


