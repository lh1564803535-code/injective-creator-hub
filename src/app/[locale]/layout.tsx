import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {Geist, Geist_Mono} from 'next/font/google';
import {WalletProvider} from '@/components/wallet-provider';
import {AppNavigation} from '@/components/app-navigation';
import {Footer} from '@/components/Footer';
import {QuickActionsToolbar} from '@/components/ui/QuickActionsToolbar';
import {AIAssistant} from '@/components/creator/AIAssistant';
import {TestnetBanner} from '@/components/ui/TestnetBanner';
import {BackToTop} from '@/components/ui/BackToTop';
import {NotificationProvider} from '@/components/ui/NotificationCenter';
import {CommandPaletteProvider} from '@/components/ui/CommandPalette';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed]">
        <NextIntlClientProvider messages={messages}>
          <WalletProvider>
            <NotificationProvider>
              <CommandPaletteProvider>
                <TestnetBanner />
                <AppNavigation />
                <main className="flex-1">{children}</main>
                <Footer />
                <QuickActionsToolbar />
                <BackToTop />
                <AIAssistant />
              </CommandPaletteProvider>
            </NotificationProvider>
          </WalletProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
