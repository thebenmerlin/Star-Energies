import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Energies | Industrial Coal, Sourced to Requirement",
  description: "Requirement-led industrial coal sourcing and supply from Wani, Maharashtra.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
