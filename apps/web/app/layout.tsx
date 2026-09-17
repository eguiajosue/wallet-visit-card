import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VisitPass — Loyalty, built in',
  description: 'Gestiona programas de visitas y tarjetas para Wallet.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}

