import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "kia",
  description: "System dydaktyczny Katedry Informatyki i Automatyki"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>
        <a className="skip-link" href="#main">Przejdź do treści</a>
        {children}
      </body>
    </html>
  );
}
