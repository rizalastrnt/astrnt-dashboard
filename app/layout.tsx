import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astrnt Dashboard - Login",
  description: "Login to Astrnt Dashboard",
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
