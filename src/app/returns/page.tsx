import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Feel It | 14-Day Returns",
  description:
    "Learn about Feel It's 14-day return and refund policy for eligible fragrance orders. Free returns on unopened items with original packaging.",
  keywords: "return policy, refund policy, Feel It returns, perfume returns, 14 day return policy",
  openGraph: {
    title: "Return & Refund Policy | Feel It",
    description: "Learn about Feel It's 14-day return and refund policy for eligible fragrance orders.",
    type: "website",
  },
  alternates: {
    canonical: "/returns",
  },
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 pt-4">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl tracking-wide text-neutral-900">
          Return & Refund Policy
        </h1>
        <p className="text-sm text-neutral-600">
          We want you to feel confident shopping with us. Please review the
          terms below before placing your order.
        </p>
      </div>

      <div className="space-y-4 text-sm text-neutral-700">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-neutral-900">
            14-Day Return Window
          </h2>
          <p>
            Eligible items can be returned within 14 days of delivery as long as
            they are unopened, unused, and in their original packaging with all
            labels intact.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-neutral-900">
            Non-Returnable Items
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Opened or partially used perfumes and oils</li>
            <li>Explorer kits and testers once any vial is used</li>
            <li>Items purchased during final clearance sales</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-neutral-900">
            Damaged or Incorrect Orders
          </h2>
          <p>
            If your parcel arrives damaged or you receive the wrong item,
            please contact us within 48 hours of delivery with clear photos of
            the outer packaging, product, and invoice so we can assist you
            promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-neutral-900">
            Refund Method
          </h2>
          <p>
            Approved refunds are processed back to your original payment method
            or issued as store credit where applicable. Processing times may
            vary based on your bank or payment provider.
          </p>
        </section>
      </div>
    </div>
  );
}


