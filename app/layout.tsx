import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Do you still love me?",
  description: "A romantic interactive experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dancingScript.className}>{children}</body>
    </html>
  );
}
