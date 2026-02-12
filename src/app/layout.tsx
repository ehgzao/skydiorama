import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkyDiorama - AI Weather Dioramas',
  description: 'Free, open-source weather app that generates beautiful AI-powered 3D isometric city dioramas based on real weather data.',
  keywords: ['weather', 'ai', 'diorama', 'isometric', 'gemini', 'open-source', 'free'],
  authors: [{ name: 'SkyDiorama Community' }],
  openGraph: {
    title: 'SkyDiorama - AI Weather Dioramas',
    description: 'Transform your weather into art. Free and open-source.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyDiorama - AI Weather Dioramas',
    description: 'Transform your weather into art. Free and open-source.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
