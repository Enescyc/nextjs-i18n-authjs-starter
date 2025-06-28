import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  let validLocale: string = locale || 'en';
  
  if (!routing.locales.includes(validLocale as (typeof routing.locales)[number])) {
    validLocale = 'en';
  }
  
  const messages = (await import(`../../messages/${validLocale}.json`)).default;
 
  return {
    locale: validLocale,
    messages
  };
});