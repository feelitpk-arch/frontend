import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Feel It | Premium Fragrance E‑Boutique",
    template: "%s | Feel It",
  },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // User layout is now handled by UserLayoutWrapper in root layout
  // This layout is just for metadata
  return <>{children}</>;
}

