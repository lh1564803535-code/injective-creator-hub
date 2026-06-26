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
    <div className="flex min-h-screen items-center justify-center bg-[#08080f]">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">{t('error')}</h2>
        <p className="mb-6 text-sm text-gray-500">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}
