import {useTranslations} from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080f]">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-300">{t('notFound')}</h2>
        <p className="mb-8 text-gray-500">
          {t('notFoundDesc')}
        </p>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white"
        >
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}
