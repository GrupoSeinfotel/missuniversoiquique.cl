import type { Metadata } from "next";
import "./globals.css";
import SystemChannelNotifier from "@/components/ui/SystemChannelNotifier";


export const metadata: Metadata = {
  metadataBase: new URL("https://missuniversoiquique.cl"),
  title: {
    default: "Miss Universe Iquique | Sitio Oficial",
    template: "%s | Miss Universe Iquique"
  },
  description: "La plataforma oficial del certamen de belleza más importante de la región. Sé parte del legado.",
  keywords: ["Miss Universe", "Iquique", "Concurso de belleza", "Chile", "Certamen", "Modelo"],
  authors: [{ name: "Miss Universe Iquique" }],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://missuniversoiquique.cl',
    siteName: 'Miss Universe Iquique',
    title: 'Miss Universe Iquique | Sitio Oficial',
    description: 'La plataforma oficial del certamen de belleza más importante de la región. Sé parte del legado.',
    images: [{
      url: '/og-image-iquique.png',
      width: 1200,
      height: 630,
      alt: 'Miss Universe Iquique - Logo Oficial'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miss Universe Iquique | Sitio Oficial',
    description: 'La plataforma oficial del certamen de belleza más importante de la región.',
    images: ['/og-image-iquique.png']
  },
  alternates: {
    canonical: 'https://missuniversoiquique.cl',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <SystemChannelNotifier />
      </body>
    </html>
  );
}
