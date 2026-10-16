import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SITE_DESCRIPTION_FR,
  SITE_NAME_FR,
  SITE_URL,
} from "../../lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BouffePourTous — Trouvez de la nourriture gratuite au Québec",
    template: "%s | BouffePourTous",
  },
  description: SITE_DESCRIPTION_FR,
  applicationName: "BouffePourTous",
  keywords: [
    "aide alimentaire",
    "banque alimentaire",
    "frigo communautaire",
    "repas communautaire",
    "soupe populaire",
    "épicerie communautaire",
    "nourriture gratuite",
    "Québec",
    "insécurité alimentaire",
    "food bank",
    "community fridge",
    "Quebec",
  ],
  authors: [{ name: "BouffePourTous" }],
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/?lang=en",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME_FR,
    title: "BouffePourTous — Trouvez de la nourriture gratuite au Québec",
    description: SITE_DESCRIPTION_FR,
    locale: "fr_CA",
    alternateLocale: ["en_CA"],
  },
  twitter: {
    card: "summary",
    title: "BouffePourTous — Nourriture gratuite au Québec",
    description: SITE_DESCRIPTION_FR,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME_FR,
    alternateName: "FoodForAll",
    url: SITE_URL,
    inLanguage: ["fr-CA", "en-CA"],
    description: SITE_DESCRIPTION_FR,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
