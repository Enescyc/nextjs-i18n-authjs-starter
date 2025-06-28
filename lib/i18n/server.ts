import {getTranslations} from 'next-intl/server';
import {routing} from './routing';

/**
 * Server-side translation helper that ensures proper locale fallback
 */
export async function getServerTranslations(locale: string, namespace?: string) {
  // Validate locale
  const validLocale = routing.locales.includes(locale as (typeof routing.locales)[number]) 
    ? locale 
    : routing.defaultLocale;
    
  try {
    if (namespace) {
      return await getTranslations({locale: validLocale, namespace});
    }
    return await getTranslations({locale: validLocale});
  } catch (error) {
    console.error(`Failed to get translations for locale ${validLocale}, namespace ${namespace}:`, error);
    
    // Fallback to default locale
    if (namespace) {
      return await getTranslations({locale: routing.defaultLocale, namespace});
    }
    return await getTranslations({locale: routing.defaultLocale});
  }
}

/**
 * Type-safe parameter parser for server components
 */
export async function parseLocaleParams(params: Promise<{locale: string}>): Promise<string> {
  const {locale} = await params;
  return routing.locales.includes(locale as (typeof routing.locales)[number]) ? locale : routing.defaultLocale;
}