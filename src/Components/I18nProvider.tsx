'use client';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', lng);
      }
    };

    const savedLang = localStorage.getItem('lang');
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    } else {
      // Set initial direction based on the current language
      handleLanguageChange(i18n.language || 'en');
    }

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
