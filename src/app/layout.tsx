import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xplitter - Divide gastos fácilmente",
  description: "Calculadora de gastos compartidos para juntadas y/o eventos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-dark-bg text-slate-100`}>
        {children}
      </body>
    </html>
  );
}