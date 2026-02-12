export type ProductCategory =
  | "best-sellers"
  | "weekly-deals"
  | "testers"
  | "explorer-kits"
  | "men"
  | "women"
  | "new-arrivals"
  | "colognes"
  | "roll-ons";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  notes: string;
  price: number;
  sizes: number[];
  defaultSize: number;
  category: ProductCategory;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  image: string;
  gallery: string[];
};

export const products: Product[] = [
  {
    id: "1",
    slug: "noir-amber-eau-de-parfum",
    name: "Noir Amber Eau De Parfum",
    description: "A deep amber blend with soft vanilla and smoky woods.",
    notes: "Amber, vanilla, incense, sandalwood",
    price: 3899,
    sizes: [50, 100],
    defaultSize: 100,
    category: "men",
    isBestSeller: true,
    isNewArrival: true,
    image: "/images/products/noir-amber-1.jpg",
    gallery: [
      "/images/products/noir-amber-1.jpg",
      "/images/products/noir-amber-2.jpg",
    ],
  },
  {
    id: "2",
    slug: "celestial-musk",
    name: "Celestial Musk",
    description: "Airy white musk wrapped in clean florals and soft woods.",
    notes: "White musk, jasmine, pear blossom, cashmere wood",
    price: 3499,
    sizes: [50, 100],
    defaultSize: 50,
    category: "women",
    isBestSeller: true,
    image: "/images/products/celestial-musk-1.jpg",
    gallery: [
      "/images/products/celestial-musk-1.jpg",
      "/images/products/celestial-musk-2.jpg",
    ],
  },
  {
    id: "3",
    slug: "desert-oud-essence",
    name: "Desert Oud Essence",
    description: "Smoky oud with saffron and dried fruits for a rich trail.",
    notes: "Oud, saffron, dried plum, patchouli",
    price: 5299,
    sizes: [50, 100],
    defaultSize: 50,
    category: "colognes",
    isBestSeller: true,
    image: "/images/products/desert-oud-1.jpg",
    gallery: [
      "/images/products/desert-oud-1.jpg",
      "/images/products/desert-oud-2.jpg",
    ],
  },
  {
    id: "4",
    slug: "linen-morning",
    name: "Linen Morning",
    description: "Crisp citrus and neroli evoking freshly pressed linen.",
    notes: "Bergamot, neroli, petitgrain, musk",
    price: 2999,
    sizes: [50, 100],
    defaultSize: 100,
    category: "weekly-deals",
    isBestSeller: true,
    image: "/images/products/linen-morning-1.jpg",
    gallery: [
      "/images/products/linen-morning-1.jpg",
      "/images/products/linen-morning-2.jpg",
    ],
  },
  {
    id: "5",
    slug: "rose-veiled-veil",
    name: "Rose Veiled Veil",
    description: "A sheer rose wrapped in powdery iris and soft woods.",
    notes: "Damask rose, iris, violet leaf, sandalwood",
    price: 4199,
    sizes: [50],
    defaultSize: 50,
    category: "women",
    isNewArrival: true,
    image: "/images/products/rose-veiled-1.jpg",
    gallery: [
      "/images/products/rose-veiled-1.jpg",
      "/images/products/rose-veiled-2.jpg",
    ],
  },
  {
    id: "6",
    slug: "midnight-atlas",
    name: "Midnight Atlas",
    description: "Spiced citrus over dark woods for an urban evening scent.",
    notes: "Grapefruit, cardamom, cedarwood, vetiver",
    price: 3799,
    sizes: [50, 100],
    defaultSize: 100,
    category: "men",
    image: "/images/products/midnight-atlas-1.jpg",
    gallery: [
      "/images/products/midnight-atlas-1.jpg",
      "/images/products/midnight-atlas-2.jpg",
    ],
  },
  {
    id: "7",
    slug: "atelier-explorer-kit",
    name: "Atelier Explorer Kit",
    description: "Five curated vials to discover our signature collections.",
    notes: "Assorted: floral, amber, citrus, musk, oud",
    price: 2499,
    sizes: [5],
    defaultSize: 5,
    category: "explorer-kits",
    image: "/images/products/atelier-explorer-1.jpg",
    gallery: [
      "/images/products/atelier-explorer-1.jpg",
      "/images/products/atelier-explorer-2.jpg",
    ],
  },
  {
    id: "8",
    slug: "amber-ink-roller",
    name: "Amber Ink Roller",
    description: "Pocket-sized roll-on with warm amber and vanilla.",
    notes: "Amber, vanilla, tonka bean",
    price: 1199,
    sizes: [10],
    defaultSize: 10,
    category: "roll-ons",
    isBestSeller: true,
    image: "/images/products/amber-ink-1.jpg",
    gallery: [
      "/images/products/amber-ink-1.jpg",
      "/images/products/amber-ink-2.jpg",
    ],
  },
];

export const bestSellers = products.filter((p) => p.isBestSeller);


