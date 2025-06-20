'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Optional config
NProgress.configure({ showSpinner: false });

export default function NProgressHandler() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Skip progress bar on first page load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Start NProgress
    NProgress.start();

    // Stop it after short delay (simulate async route loading)
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
