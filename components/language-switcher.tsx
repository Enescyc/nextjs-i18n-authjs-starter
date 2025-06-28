'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/lib/i18n/routing';
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleLanguageChange('en')}
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
      >
        EN
      </Button>
      <Button
        onClick={() => handleLanguageChange('tr')}
        variant={locale === 'tr' ? 'default' : 'outline'}
        size="sm"
      >
        TR
      </Button>
    </div>
  );
}