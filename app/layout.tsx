import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GO Online - Juego Milenario con IA',
  description: 'Juega al juego de Go contra una IA avanzada. Desarrollado por Nex-Tech-IA.',
  keywords: ['go', 'juego', 'ia', 'inteligencia artificial', 'claude', 'estrategia'],
  authors: [{ name: 'Nex-Tech-IA', url: 'https://nex-tech-ia.replit.app/' }],
  openGraph: {
    title: 'GO Online - Juego Milenario con IA',
    description: 'Juega al juego de Go contra una IA avanzada',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>囲</text></svg>" />
        <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
