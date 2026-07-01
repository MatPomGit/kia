import type { Metadata } from "next";
import "./globals.css";

const siteIcon = "https://kia.prz.edu.pl/wp-content/uploads/2025/11/cropped-cropped-kia-150x144.png";

export const metadata: Metadata = {
  title: "kia",
  description: "System dydaktyczny Katedry Informatyki i Automatyki",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: siteIcon,
        sizes: "150x144",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: siteIcon,
        sizes: "150x144",
        type: "image/png"
      }
    ]
  }
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
