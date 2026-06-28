import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'zh'];

export default getRequestConfig(async ({locale}) => {
  // Handle undefined locale during middleware redirects
  const resolvedLocale = locales.includes(locale as string) ? locale : 'en';

  return {
    locale: resolvedLocale as string,
    messages: (await import(`./${resolvedLocale}.json`)).default
  };
});
