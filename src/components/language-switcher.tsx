'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const switchLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'zh' : 'en';
    const newPath = pathname.replace(/^\/[^/]+/, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Button variant="ghost" size="icon" onClick={switchLanguage} className="h-9 w-9">
      {currentLocale === 'en' ? '中' : 'EN'}
    </Button>
  );
}
