import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {Geist, Geist_Mono} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {WalletProvider} from '@/components/wallet-provider';
import {AppNavigation} from '@/components/app-navigation';
import {Footer} from '@/components/Footer';
import {TestnetBanner} from '@/components/ui/TestnetBanner';
import {NotificationProvider} from '@/components/ui/NotificationCenter';
import {CommandPaletteProvider} from '@/components/ui/CommandPalette';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home'});
  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <WalletProvider>
        <NotificationProvider>
          <CommandPaletteProvider>
            <TestnetBanner />
            <AppNavigation />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </CommandPaletteProvider>
        </NotificationProvider>
      </WalletProvider>
    </NextIntlClientProvider>
  );
}
