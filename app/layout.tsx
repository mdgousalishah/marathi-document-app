import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marathi Patra - मराठी पत्र लेखन',
  description: 'मराठी अधिकृत पत्रे, अर्ज, तक्रार आणि शासकीय पत्रे सहजपणे लिहा आणि PDF/Word मध्ये डाउनलोड करा.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Marathi Patra',
  },
  openGraph: {
    title: 'Marathi Patra - मराठी पत्र लेखन',
    description: 'मराठी अधिकृत पत्रे, अर्ज, तक्रार आणि शासकीय पत्रे सहजपणे लिहा आणि PDF/Word मध्ये डाउनलोड करा.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marathi Patra - मराठी पत्र लेखन',
    description: 'मराठी अधिकृत पत्रे, अर्ज, तक्रार आणि शासकीय पत्रे सहजपणे लिहा आणि PDF/Word मध्ये डाउनलोड करा.',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e1b4b',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="mr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="font-sans bg-slate-100 text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-800">
        {children}
      </body>
    </html>
  );
}
