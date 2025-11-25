'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from '@/components/i18n/I18nProvider';

const STORAGE_KEY = 'demo-banner-dismissed';

export default function DemoBanner() {
  const t = useTranslations('banner');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 dark:from-amber-500 dark:via-orange-500 dark:to-amber-600 text-foreground shadow-lg border-b border-amber-600 dark:border-amber-700 animate-in slide-in-from-top duration-300">
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 md:px-6">
        <div className="flex items-center justify-center gap-3">
          <p className="text-sm sm:text-base font-medium text-center flex-1 px-2">
            {t('message')}
          </p>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-amber-600/30 dark:hover:bg-amber-700/30 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-700 dark:focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-400 dark:focus:ring-offset-amber-600"
            aria-label={t('closeLabel')}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

