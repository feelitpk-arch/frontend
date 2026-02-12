import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Locations | Feel It | Find Our Stores",
  description:
    "Discover Feel It partner stores and pickup points across major cities in Pakistan. Visit us in Karachi, Lahore, and Islamabad.",
  keywords: "Feel It locations, perfume stores Pakistan, fragrance stores Karachi, perfume stores Lahore, perfume stores Islamabad",
  openGraph: {
    title: "Store Locations | Feel It",
    description: "Discover Feel It partner stores and pickup points across major cities in Pakistan.",
    type: "website",
  },
  alternates: {
    canonical: "/locations",
  },
};

const locations = [
  {
    city: "Karachi",
    spots: [
      {
        name: "Feel It – Clifton Counter",
        address: "Ground Floor, Coastal Galleria, Clifton Block 4",
      },
      {
        name: "Scent Edit – Zamzama",
        address: "Lane 4, Zamzama Commercial Area, DHA",
      },
    ],
  },
  {
    city: "Lahore",
    spots: [
      {
        name: "Aurora Fragrance Bar",
        address: "Main Boulevard, Gulberg III",
      },
      {
        name: "Feel It – Emporium Kiosk",
        address: "Emporium Mall, Johar Town",
      },
    ],
  },
  {
    city: "Islamabad",
    spots: [
      {
        name: "Hillline Perfume Corner",
        address: "Jinnah Avenue, Blue Area",
      },
    ],
  },
];

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-4">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl tracking-wide text-neutral-900">
          Store Locations
        </h1>
        <p className="text-sm text-neutral-600">
          Experience our fragrances in person at select partner counters and
          kiosks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {locations.map((city) => (
          <section
            key={city.city}
            className="space-y-3 rounded-2xl border border-neutral-100 bg-white p-4 text-sm text-neutral-700 shadow-sm shadow-black/5"
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              {city.city}
            </h2>
            <ul className="space-y-3">
              {city.spots.map((spot) => (
                <li key={spot.name}>
                  <p className="font-medium text-neutral-900">{spot.name}</p>
                  <p className="text-xs text-neutral-600">{spot.address}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}


