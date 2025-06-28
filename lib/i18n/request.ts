import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  let validLocale: string = locale || routing.defaultLocale;
  
  if (!routing.locales.includes(validLocale as (typeof routing.locales)[number])) {
    validLocale = routing.defaultLocale;
  }
  
  try {
    const messages = (await import(`../../messages/${validLocale}.json`)).default;
    
    return {
      locale: validLocale,
      messages,
      timeZone: 'Europe/Istanbul', // Add timezone support
      now: new Date()
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error);
    
    // Fallback to default locale if message loading fails
    const fallbackMessages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
    
    return {
      locale: routing.defaultLocale,
      messages: fallbackMessages,
      timeZone: 'Europe/Istanbul',
      now: new Date()
    };
  }
});