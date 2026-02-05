import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditii. This is for you bacchaa",
  description:
    "Play a unique Valentine's card game. Complete the collection to reveal a romantic proposal!",
  keywords: [
    "Valentine's card game",
    "romantic proposal game",
    "photo card challenge",
    "Valentine's Day surprise",
    "couples game",
    "valentine's day game",
    "proposal game",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
