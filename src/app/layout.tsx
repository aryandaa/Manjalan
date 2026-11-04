import type { Metadata, Viewport } from 'next';
import './globals.css';
import MobileContainer from '@/components/MobileContainer';

export const metadata: Metadata = {
  title: 'MANJALAN — Menjelajah Isen Mulang, Lebih Siap Setiap Langkah',
  description:
    'Travel readiness platform pertama untuk ekowisata Kalimantan Tengah. Hitung budget realistik, verifikasi pembayaran digital QRIS/tunai UMKM sekitar, dan bawa Travel Pack offline tanpa sinyal.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo/app-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#faf8ff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        <MobileContainer>{children}</MobileContainer>
      </body>
    </html>
  );
}
