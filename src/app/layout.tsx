import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fusionn',
  description: 'Subtitle Processing Tool',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
