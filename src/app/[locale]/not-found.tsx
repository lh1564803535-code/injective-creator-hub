import {useTranslations} from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-[#EAECEF]">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-[#EAECEF]">{t('notFound')}</h2>
        <p className="mb-8 text-[#848E9C]">{t('notFoundDesc')}</p>
        <Link
          href="/"
          className="rounded-xl bg-[#00D4AA] px-6 py-3 font-semibold text-white"
        >
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}
