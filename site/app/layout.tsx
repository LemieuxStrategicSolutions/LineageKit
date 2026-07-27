import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Family Archive", template: "%s · Family Archive" },
  description: "A sourced, evolving archive of the deceased ancestors in a family tree. Every claim carries its evidence label.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
