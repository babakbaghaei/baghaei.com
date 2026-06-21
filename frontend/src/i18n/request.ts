import { getRequestConfig } from 'next-intl/server';

export const locales = ['fa', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fa';

// No i18n routing yet — the site serves the default (Persian) locale and the
// message catalogs provide the translation structure. When English pages are
// introduced, resolve the active locale here (from a cookie or a route segment)
// and the rest of the wiring (provider, hreflang) is already in place.
export default getRequestConfig(async () => {
  const locale = defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
