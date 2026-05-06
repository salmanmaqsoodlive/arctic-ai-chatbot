import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arctic Air HVAC | Fast, Reliable Heating & Cooling in Los Angeles',
  description:
    'Expert AC repair, heating, installation & maintenance in LA. Licensed, insured, 24/7. Free estimates. Call (310) 555-0100.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} min-h-full antialiased`}>{children}</body>
    </html>
  );
}
