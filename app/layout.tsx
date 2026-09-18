import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marathi Patra - मराठी पत्र लेखन',
  description: 'मराठी अधिकृत पत्रे, अर्ज, तक्रार आणि शासकीय पत्रे सहजपणे लिहा आणि PDF/Word मध्ये डाउनलोड करा.',
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
