export type SiteLanguage = 'zh' | 'en';

export const caseSlugById: Record<string, string> = {
  'gate-domain': 'gate-domain-migration',
  'ai-pmo': 'ai-pmo-automation',
  'design-delivery-automation': 'design-delivery-automation',
  'growth-portfolio': 'seo-geo-aso-portfolio',
  'coins-localization': 'coins-global-expansion',
  'binance-fiat': 'binance-global-payments',
};

export function normalizeRoutePath(pathname: string) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
}

export function parseLocalizedPath(pathname: string) {
  const normalizedPath = normalizeRoutePath(pathname);
  const isEnglishPath = normalizedPath === '/en' || normalizedPath.startsWith('/en/');
  const routePath = isEnglishPath
    ? normalizeRoutePath(normalizedPath.slice(3) || '/')
    : normalizedPath;

  return {
    language: (isEnglishPath ? 'en' : 'zh') as SiteLanguage,
    routePath,
  };
}

export function localizePath(routePath: string, language: SiteLanguage) {
  const normalizedRoute = normalizeRoutePath(routePath);
  if (language === 'zh') return normalizedRoute;
  return normalizedRoute === '/' ? '/en/' : `/en${normalizedRoute}`;
}

export function getCasePath(caseId: string, language: SiteLanguage) {
  const slug = caseSlugById[caseId];
  return slug ? localizePath(`/cases/${slug}`, language) : localizePath('/', language);
}

export function getJournalPath(slug: string | null, language: SiteLanguage) {
  return localizePath(slug ? `/journal/${slug}` : '/journal', language);
}
