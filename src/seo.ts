type SeoLanguage = 'zh' | 'en';

type SeoPage = {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
  publishedTime?: string;
};

const siteUrl = 'https://www.baixi.xyz';
const socialImage = `${siteUrl}/og-image.png`;
const linkedInUrl = 'https://www.linkedin.com/in/baixiliu/';

const pages: Record<string, Record<SeoLanguage, SeoPage>> = {
  '/': {
    zh: {
      title: '刘柏希｜PMO、项目集管理与全球化交付',
      description:
        '刘柏希（Cyril Liu）的个人网站，记录项目治理、项目集管理、全球支付、国际化落地、增长项目与 AI PMO 自动化方面的经历、案例与方法。',
      path: '/',
      type: 'website',
    },
    en: {
      title: 'Cyril Liu | PMO, Program & Portfolio Management',
      description:
        'Cyril Liu shares selected work in program governance, global payments, market launches, growth portfolios, and AI-enabled PMO workflows.',
      path: '/',
      type: 'website',
    },
  },
  '/journal': {
    zh: {
      title: '学习札记｜Vibe Coding 与 AI PMO｜刘柏希',
      description: '刘柏希的学习札记，记录 Vibe Coding、AI PMO、个人工作流与非技术背景下的 AI 协作开发实践。',
      path: '/journal',
      type: 'website',
    },
    en: {
      title: 'Working Notes | Vibe Coding and AI PMO | Cyril Liu',
      description: 'Working notes by Cyril Liu on Vibe Coding, AI PMO, personal workflows, and AI-assisted delivery as a non-engineer.',
      path: '/journal',
      type: 'website',
    },
  },
  '/journal/vibe-coding-portfolio-retrospective': {
    zh: {
      title: '从一个个人网站开始，重新理解 Vibe Coding｜刘柏希',
      description: '一次个人网站项目复盘：产品定义、提示词设计、设计验收，以及非技术背景下与 AI 协作开发的真实经验。',
      path: '/journal/vibe-coding-portfolio-retrospective',
      type: 'article',
      publishedTime: '2026-06-03',
    },
    en: {
      title: 'What Building My Portfolio Taught Me About Vibe Coding | Cyril Liu',
      description: 'A practical reflection on product framing, prompt design, visual review, and AI-assisted delivery while building a personal portfolio.',
      path: '/journal/vibe-coding-portfolio-retrospective',
      type: 'article',
      publishedTime: '2026-06-03',
    },
  },
  '/journal/baixi-xyz-launch-log': {
    zh: {
      title: '从买服务器到网站上线的第一条流水线｜刘柏希',
      description: 'baixi.xyz 从服务器、域名和 DNS 到 Nginx、HTTPS 与备案的完整上线记录，也是一场非技术背景下的 AI 协作实践。',
      path: '/journal/baixi-xyz-launch-log',
      type: 'article',
      publishedTime: '2026-05-23',
    },
    en: {
      title: 'From Buying a Server to Launching My First Site | Cyril Liu',
      description: 'A first-person build log covering the server, domain, DNS, firewall, Nginx, HTTPS, and ICP filing behind baixi.xyz.',
      path: '/journal/baixi-xyz-launch-log',
      type: 'article',
      publishedTime: '2026-05-23',
    },
  },
};

function normalizePath(pathname: string) {
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '');
}

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function setCanonical(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function personSchema() {
  return {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: '刘柏希',
    alternateName: 'Cyril Liu',
    url: siteUrl,
    jobTitle: 'PMO / Program & Portfolio Management Lead',
    description:
      'Business-facing PMO and program management lead with experience in portfolio governance, global payments, market launches, growth programs, and AI-enabled workflows.',
    sameAs: [linkedInUrl],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'The University of Manchester' },
      { '@type': 'CollegeOrUniversity', name: 'Tianfu College of SWUFE' },
    ],
    knowsAbout: [
      'Program Management',
      'Portfolio Governance',
      'Project Governance',
      'Global Delivery',
      'Risk Management',
      'AI PMO',
    ],
  };
}

function buildStructuredData(page: SeoPage, language: SeoLanguage) {
  const canonicalUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
  const inLanguage = language === 'zh' ? 'zh-CN' : 'en';
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: '刘柏希 / Cyril Liu',
    alternateName: 'Cyril Liu Portfolio',
    inLanguage: ['zh-CN', 'en'],
  };

  if (page.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        website,
        personSchema(),
        {
          '@type': 'ProfilePage',
          '@id': `${siteUrl}/#profile`,
          url: canonicalUrl,
          name: page.title,
          description: page.description,
          inLanguage,
          isPartOf: { '@id': `${siteUrl}/#website` },
          mainEntity: { '@id': `${siteUrl}/#person` },
        },
      ],
    };
  }

  if (page.type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        website,
        personSchema(),
        {
          '@type': 'BlogPosting',
          '@id': `${canonicalUrl}#article`,
          url: canonicalUrl,
          headline: page.title.split('｜')[0].split(' | Cyril Liu')[0],
          description: page.description,
          image: socialImage,
          datePublished: page.publishedTime,
          dateModified: page.publishedTime,
          inLanguage,
          mainEntityOfPage: canonicalUrl,
          author: { '@id': `${siteUrl}/#person` },
          isPartOf: { '@id': `${siteUrl}/journal#blog` },
        },
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      personSchema(),
      {
        '@type': 'Blog',
        '@id': `${siteUrl}/journal#blog`,
        url: canonicalUrl,
        name: page.title,
        description: page.description,
        inLanguage,
        author: { '@id': `${siteUrl}/#person` },
      },
    ],
  };
}

export function applySeoMetadata(pathname: string, language: SeoLanguage) {
  const normalizedPath = normalizePath(pathname);
  const page = pages[normalizedPath]?.[language] ?? pages[normalizedPath]?.zh;
  const isKnownPage = Boolean(page);
  const resolvedPage = page ?? pages['/'][language];
  const canonicalUrl = `${siteUrl}${resolvedPage.path === '/' ? '/' : resolvedPage.path}`;
  const locale = language === 'zh' ? 'zh_CN' : 'en_US';

  document.title = resolvedPage.title;
  setCanonical(canonicalUrl);
  setMeta('meta[name="description"]', { name: 'description', content: resolvedPage.description });
  setMeta('meta[name="author"]', { name: 'author', content: '刘柏希 / Cyril Liu' });
  setMeta('meta[name="robots"]', {
    name: 'robots',
    content: isKnownPage ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' : 'noindex,follow',
  });
  setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: '刘柏希 / Cyril Liu' });
  setMeta('meta[property="og:type"]', { property: 'og:type', content: resolvedPage.type });
  setMeta('meta[property="og:title"]', { property: 'og:title', content: resolvedPage.title });
  setMeta('meta[property="og:description"]', { property: 'og:description', content: resolvedPage.description });
  setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  setMeta('meta[property="og:locale"]', { property: 'og:locale', content: locale });
  setMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage });
  setMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
  setMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
  setMeta('meta[property="og:image:alt"]', {
    property: 'og:image:alt',
    content: language === 'zh' ? '刘柏希个人网站封面' : 'Cyril Liu portfolio cover',
  });
  setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: resolvedPage.title });
  setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: resolvedPage.description });
  setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage });

  if (resolvedPage.publishedTime) {
    setMeta('meta[property="article:published_time"]', {
      property: 'article:published_time',
      content: resolvedPage.publishedTime,
    });
  } else {
    document.head.querySelector('meta[property="article:published_time"]')?.remove();
  }

  let structuredData = document.head.querySelector<HTMLScriptElement>('#page-structured-data');
  if (!structuredData) {
    structuredData = document.createElement('script');
    structuredData.id = 'page-structured-data';
    structuredData.type = 'application/ld+json';
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify(buildStructuredData(resolvedPage, language));
}
