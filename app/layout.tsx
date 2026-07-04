import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tyrees Mobile Detailing | Suds.to",
  description: "A showcase Suds.to profile for Tyrees Mobile Detailing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
