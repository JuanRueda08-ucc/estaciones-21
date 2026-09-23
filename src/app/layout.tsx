import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuatro estaciones contigo",
  description: "Una carta interactiva para revelar cuatro regalos, uno por cada estación.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
