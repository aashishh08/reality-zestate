'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

/**
 * Loads GA4 on public routes only. Skips /admin so internal traffic is not tracked.
 */
export function PublicGoogleAnalytics() {
  const pathname = usePathname();
  const isPublicRoute = Boolean(GA_MEASUREMENT_ID) && !pathname.startsWith('/admin');

  useEffect(() => {
    if (!isPublicRoute || typeof window.gtag !== 'function') return;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [isPublicRoute, pathname]);

  if (!isPublicRoute) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
