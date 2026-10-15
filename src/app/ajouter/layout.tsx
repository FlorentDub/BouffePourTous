import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter une ressource",
  description:
    "Ajoutez une ressource d'aide alimentaire à la carte collaborative BouffePourTous : banque alimentaire, frigo communautaire, repas ou épicerie communautaire au Québec.",
  alternates: {
    canonical: "/ajouter",
  },
};

export default function AjouterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
