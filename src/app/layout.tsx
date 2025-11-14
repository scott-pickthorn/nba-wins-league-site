import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NBA Wins League",
  description: "Fantasy wins league standings for NBA teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
