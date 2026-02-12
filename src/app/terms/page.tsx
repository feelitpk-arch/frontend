import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Feel It",
  description:
    "Read our terms and conditions for using Feel It's premium perfume e-commerce platform. Understand your rights and responsibilities when shopping with us.",
  keywords: "terms and conditions, Feel It, perfume e-commerce, user agreement, privacy policy",
  openGraph: {
    title: "Terms and Conditions | Feel It",
    description: "Read our terms and conditions for using Feel It's premium perfume e-commerce platform.",
    type: "website",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl tracking-wide text-neutral-900">
          Terms and Conditions
        </h1>
        <p className="text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-neutral-700">
        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Feel It website, you accept and agree to be bound by
            the terms and provision of this agreement. If you do not agree to abide by the above,
            please do not use this service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on Feel It
            Studio&apos;s website for personal, non-commercial transitory viewing only. This is the
            grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">3. Product Information</h2>
          <p>
            We strive to provide accurate product descriptions, images, and pricing. However, we do
            not warrant that product descriptions or other content on this site is accurate,
            complete, reliable, current, or error-free. If a product offered by Feel It is not
            as described, your sole remedy is to return it in unused condition.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">4. Pricing and Payment</h2>
          <p>
            All prices are in Pakistani Rupees (PKR) unless otherwise stated. We reserve the right
            to change prices at any time without prior notice. Payment must be received before
            order processing and shipment.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">5. Shipping and Delivery</h2>
          <p>
            We ship to locations within Pakistan. Shipping costs and estimated delivery times are
            provided at checkout. Free shipping is available on orders over Rs. 3,999. We are not
            responsible for delays caused by shipping carriers or customs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">6. Returns and Refunds</h2>
          <p>
            Please refer to our{" "}
            <a href="/returns" className="text-black underline hover:text-neutral-600">
              Return & Refund Policy
            </a>{" "}
            for detailed information about returns, exchanges, and refunds.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">7. Limitation of Liability</h2>
          <p>
            Feel It shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">8. Privacy Policy</h2>
          <p>
            Your use of our website is also governed by our Privacy Policy. Please review our
            Privacy Policy to understand our practices regarding the collection and use of your
            personal information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">9. Changes to Terms</h2>
          <p>
            Feel It reserves the right to revise these terms at any time without notice. By
            using this website, you are agreeing to be bound by the then current version of these
            Terms and Conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us through
            our{" "}
            <a href="/contact" className="text-black underline hover:text-neutral-600">
              Contact Us
            </a>{" "}
            page.
          </p>
        </section>
      </div>
    </div>
  );
}

