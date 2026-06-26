import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['en', 'zh'];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as string)) notFound();
  return {
    locale: locale as string,
    messages: (await import(`./${locale}.json`)).default
  };
});
