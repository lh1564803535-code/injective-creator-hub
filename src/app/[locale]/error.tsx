"use client";

import {useTranslations} from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-[#EAECEF]">{t('error')}</h2>
        <p className="mb-6 text-sm text-[#848E9C]">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-xl bg-[#00D4AA] px-6 py-3 font-semibold text-white"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}
