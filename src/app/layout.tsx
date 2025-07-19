import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// Make sure this line exists and the path is correct
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InboXpense',
  description: 'Track expenses from your SMS backups.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      {/* The `dark` class here will enable dark mode based on the shadcn/ui theme */}
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
