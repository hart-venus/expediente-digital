import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expediente Digital",
  description: "Registro de pacientes y sus expedientes médicos.",
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
