import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {Geist, Geist_Mono} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {WalletProvider} from '@/components/wallet-provider';
import {AppLayout} from '@/components/layout/AppLayout';
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
            <AppLayout>{children}</AppLayout>
          </CommandPaletteProvider>
        </NotificationProvider>
      </WalletProvider>
    </NextIntlClientProvider>
  );
}
