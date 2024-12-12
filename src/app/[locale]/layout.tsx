import { LanguageSwitcher } from '@/components/language-switcher';
import { Providers } from '@/components/providers';
import { ThemeToggle } from '@/components/theme-toggle';
import { locales } from '@/config';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Fusionn',
  description: 'Subtitle Processing Tool',
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!locales.includes(locale as any)) notFound();

  const messages = await import(`../../../messages/${locale}.json`).then(
    (module) => module.default
  );

  return (
    <Providers locale={locale} messages={messages}>
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      {children}
    </Providers>
  );
}
