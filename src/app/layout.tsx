import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahmoud Salama | Senior Laravel Backend Developer",
  description: "Interactive portfolio of Mahmoud Salama, Senior Laravel Backend Developer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
