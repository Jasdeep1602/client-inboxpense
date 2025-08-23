import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// Make sure this line exists and the path is correct
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'inboXpense',
  description: 'Track expenses from your SMS backups.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* The `dark` class here will enable dark mode based on the shadcn/ui theme */}
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster position='top-center' />
        </ThemeProvider>
        {/* Ensure the Toaster component is included in the layout */}
      </body>
    </html>
  );
}
