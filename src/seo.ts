import { localizePath, normalizeRoutePath, type SiteLanguage } from './routes';

type SeoPageType = 'website' | 'article' | 'case';

type SeoPage = {
  title: string;
  description: string;
  path: string;
  basePath: string;
  language: SiteLanguage;
  type: SeoPageType;
  publishedTime?: string;
  topics?: string[];
};

type LocalizedCopy = Record<SiteLanguage, { title: string; description: string }>;

const siteUrl = 'https://www.baixi.xyz';
const socialImage = `${siteUrl}/og-image.png`;
const linkedInUrl = 'https://www.linkedin.com/in/baixiliu/';
const lastModified = '2026-07-19';

const corePages: Array<{
  basePath: string;
  type: 'website' | 'article';
  publishedTime?: string;
  copy: LocalizedCopy;
}> = [
  {
    basePath: '/',
    type: 'website',
    copy: {
      zh: {
        title: '刘柏希｜PMO、项目集管理与全球化交付',
        description:
          '刘柏希（Cyril Liu）的个人网站，记录项目治理、项目集管理、全球支付、国际化落地、增长项目与 AI PMO 自动化方面的经历、案例与方法。',
      },
      en: {
        title: 'Cyril Liu | PMO, Program & Portfolio Management',
        description:
          'Cyril Liu shares selected work in program governance, global payments, market launches, growth portfolios, and AI-enabled PMO workflows.',
      },
    },
  },
  {
    basePath: '/journal',
    type: 'website',
    copy: {
      zh: {
        title: '学习札记｜Vibe Coding 与 AI PMO｜刘柏希',
        description: '刘柏希的学习札记，记录 Vibe Coding、AI PMO、个人工作流与非技术背景下的 AI 协作开发实践。',
      },
      en: {
        title: 'Working Notes | Vibe Coding and AI PMO | Cyril Liu',
        description: 'Working notes by Cyril Liu on Vibe Coding, AI PMO, personal workflows, and AI-assisted delivery as a non-engineer.',
      },
    },
  },
  {
    basePath: '/journal/vibe-coding-portfolio-retrospective',
    type: 'article',
    publishedTime: '2026-06-03',
    copy: {
      zh: {
        title: '从一个个人网站开始，重新理解 Vibe Coding｜刘柏希',
        description: '一次个人网站项目复盘：产品定义、提示词设计、设计验收，以及非技术背景下与 AI 协作开发的真实经验。',
      },
      en: {
        title: 'What Building My Portfolio Taught Me About Vibe Coding | Cyril Liu',
        description: 'A practical reflection on product framing, prompt design, visual review, and AI-assisted delivery while building a personal portfolio.',
      },
    },
  },
  {
    basePath: '/journal/baixi-xyz-launch-log',
    type: 'article',
    publishedTime: '2026-05-23',
    copy: {
      zh: {
        title: '从买服务器到网站上线的第一条流水线｜刘柏希',
        description: 'baixi.xyz 从服务器、域名和 DNS 到 Nginx、HTTPS 与备案的完整上线记录，也是一场非技术背景下的 AI 协作实践。',
      },
      en: {
        title: 'From Buying a Server to Launching My First Site | Cyril Liu',
        description: 'A first-person build log covering the server, domain, DNS, firewall, Nginx, HTTPS, and ICP filing behind baixi.xyz.',
      },
    },
  },
];

const casePages: Array<{ basePath: string; topics: string[]; copy: LocalizedCopy }> = [
  {
    basePath: '/cases/gate-domain-migration',
    topics: ['Brand migration', 'Domain migration', 'Risk management', 'Cutover governance'],
    copy: {
      zh: {
        title: 'Gate.io 到 Gate.com：3 周完成全站品牌与域名迁移｜刘柏希',
        description: 'Gate.io 到 Gate.com 的品牌与域名迁移案例：覆盖多端、多语言和多触点，以责任清单、切换窗口、验收证据和风险同步完成三周迁移。',
      },
      en: {
        title: 'Gate.io to Gate.com: A Three-Week Brand and Domain Migration | Cyril Liu',
        description: 'A case study on coordinating a three-week, multi-surface brand and domain migration through ownership maps, cutover windows, validation evidence, and daily risk review.',
      },
    },
  },
  {
    basePath: '/cases/ai-pmo-automation',
    topics: ['AI PMO', 'PMO automation', 'Project reporting', 'Risk detection'],
    copy: {
      zh: {
        title: 'AI PMO 自动化：把高频项目工作整理成可复用流程｜刘柏希',
        description: '结合飞书多维表格、Meegle、MCP 与 AI Skills，形成周报、迭代分析、风险梳理和 SEO 内容复盘的 AI 辅助工作流。',
      },
      en: {
        title: 'AI PMO Automation: Turning Repeated Project Work into Reusable Workflows | Cyril Liu',
        description: 'An AI-assisted PMO workflow using Bitable, Meegle, MCP, and AI Skills for reporting, sprint analysis, risk review, and SEO content operations.',
      },
    },
  },
  {
    basePath: '/cases/design-delivery-automation',
    topics: ['Design operations', 'Workflow automation', 'Meegle', 'OKR', 'Delivery analytics'],
    copy: {
      zh: {
        title: '从需求表单到 OKR 复盘：设计团队交付体系自动化｜刘柏希',
        description: '为视觉、影视、品牌和工业设计团队搭建设计提需、自动建单、排单流转、业务验收、完结通知与 OKR 效能复盘体系。',
      },
      en: {
        title: 'From Intake Forms to OKR Review: Automating Design Delivery | Cyril Liu',
        description: 'A design operations system connecting intake, automated task creation, scheduling, acceptance, completion notices, and OKR performance review.',
      },
    },
  },
  {
    basePath: '/cases/seo-geo-aso-portfolio',
    topics: ['SEO', 'GEO', 'ASO', 'Growth portfolio', 'Portfolio governance'],
    copy: {
      zh: {
        title: 'SEO、GEO、ASO：把散点增长需求收束成项目组合｜刘柏希',
        description: '通过统一需求池、组合排期、风险预警、数据看板和管理层周报，治理持续变化的 SEO、GEO 与 ASO 增长项目组合。',
      },
      en: {
        title: 'SEO, GEO, and ASO: Governing Growth Work as a Portfolio | Cyril Liu',
        description: 'A growth portfolio case covering demand intake, prioritization, risk alerts, performance dashboards, and leadership reporting across SEO, GEO, and ASO.',
      },
    },
  },
  {
    basePath: '/cases/coins-global-expansion',
    topics: ['Market expansion', 'Localization', 'Compliance', 'GTM', 'FinTech'],
    copy: {
      zh: {
        title: 'Coins.ph 国际化：在多国监管条件中找到上线路径｜刘柏希',
        description: '澳大利亚、巴西和欧洲市场拓展案例：协调产品、研发、合规、法务、运营与合作方，将监管和本地化条件转成可执行路径。',
      },
      en: {
        title: 'Coins.ph Market Expansion: Finding the Launch Path Across Regulations | Cyril Liu',
        description: 'A cross-market launch case spanning Australia, Brazil, and Europe, aligning product, engineering, compliance, legal, operations, and external partners.',
      },
    },
  },
  {
    basePath: '/cases/binance-global-payments',
    topics: ['Global payments', 'Fiat payments', 'Cross-region delivery', 'E2E delivery', 'DOD'],
    copy: {
      zh: {
        title: 'Binance 全球法币支付：跨时区与规则差异中的交付体系｜刘柏希',
        description: '全球法币支付项目案例：通过区域协作窗口、异步决策记录、E2E 流程、DOD 和风险升级机制支持跨区域交付。',
      },
      en: {
        title: 'Binance Global Fiat Payments: Delivery Across Time Zones and Rules | Cyril Liu',
        description: 'A global payments case using regional collaboration windows, async decision records, E2E flow, DOD, and escalation paths for cross-region delivery.',
      },
    },
  },
];

const pages = [...corePages, ...casePages.map((page) => ({ ...page, type: 'case' as const }))].reduce<Record<string, SeoPage>>(
  (result, page) => {
    (['zh', 'en'] as SiteLanguage[]).forEach((language) => {
      const path = localizePath(page.basePath, language);
      result[normalizeRoutePath(path)] = {
        ...page.copy[language],
        path,
        basePath: page.basePath,
        language,
        type: page.type,
        publishedTime: 'publishedTime' in page ? page.publishedTime : undefined,
        topics: 'topics' in page ? page.topics : undefined,
      };
    });
    return result;
  },
  {},
);

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

function setAlternateLinks(basePath: string) {
  document.head.querySelectorAll('link[data-localized-alternate]').forEach((element) => element.remove());
  const alternates: Array<[string, string]> = [
    ['zh-CN', localizePath(basePath, 'zh')],
    ['en', localizePath(basePath, 'en')],
    ['x-default', localizePath(basePath, 'zh')],
  ];

  alternates.forEach(([hreflang, path]) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = `${siteUrl}${path}`;
    link.dataset.localizedAlternate = 'true';
    document.head.appendChild(link);
  });
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
      'SEO and GEO Program Management',
    ],
  };
}

function breadcrumbSchema(page: SeoPage, canonicalUrl: string) {
  const isZh = page.language === 'zh';
  const parentPath = page.type === 'article' ? '/journal' : '/';
  const parentUrl = `${siteUrl}${localizePath(parentPath, page.language)}`;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isZh ? '首页' : 'Home', item: `${siteUrl}${localizePath('/', page.language)}` },
      ...(page.type === 'article'
        ? [{ '@type': 'ListItem', position: 2, name: isZh ? '学习札记' : 'Working Notes', item: parentUrl }]
        : []),
      { '@type': 'ListItem', position: page.type === 'article' ? 3 : 2, name: page.title, item: canonicalUrl },
    ],
  };
}

function buildStructuredData(page: SeoPage) {
  const canonicalUrl = `${siteUrl}${page.path}`;
  const inLanguage = page.language === 'zh' ? 'zh-CN' : 'en';
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: '刘柏希 / Cyril Liu',
    alternateName: 'Cyril Liu Portfolio',
    inLanguage: ['zh-CN', 'en'],
  };

  if (page.basePath === '/') {
    const caseUrls = casePages.map((item) => ({
      '@type': 'Article',
      '@id': `${siteUrl}${localizePath(item.basePath, page.language)}#case`,
      url: `${siteUrl}${localizePath(item.basePath, page.language)}`,
      name: item.copy[page.language].title,
    }));
    return {
      '@context': 'https://schema.org',
      '@graph': [
        website,
        personSchema(),
        {
          '@type': 'ProfilePage',
          '@id': `${canonicalUrl}#profile`,
          url: canonicalUrl,
          name: page.title,
          description: page.description,
          inLanguage,
          isPartOf: { '@id': `${siteUrl}/#website` },
          mainEntity: { '@id': `${siteUrl}/#person` },
          hasPart: caseUrls,
        },
      ],
    };
  }

  if (page.type === 'article' || page.type === 'case') {
    const articleType = page.type === 'article' ? 'BlogPosting' : 'Article';
    return {
      '@context': 'https://schema.org',
      '@graph': [
        website,
        personSchema(),
        breadcrumbSchema(page, canonicalUrl),
        {
          '@type': articleType,
          '@id': `${canonicalUrl}#${page.type}`,
          url: canonicalUrl,
          headline: page.title.replace(/｜刘柏希$/, '').replace(/ \| Cyril Liu$/, ''),
          description: page.description,
          image: socialImage,
          datePublished: page.publishedTime,
          dateModified: page.publishedTime ?? lastModified,
          inLanguage,
          mainEntityOfPage: canonicalUrl,
          author: { '@id': `${siteUrl}/#person` },
          about: page.topics,
          isPartOf:
            page.type === 'article'
              ? { '@id': `${siteUrl}${localizePath('/journal', page.language)}#blog` }
              : { '@id': `${siteUrl}${localizePath('/', page.language)}#profile` },
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
        '@id': `${canonicalUrl}#blog`,
        url: canonicalUrl,
        name: page.title,
        description: page.description,
        inLanguage,
        author: { '@id': `${siteUrl}/#person` },
      },
    ],
  };
}

export function applySeoMetadata(pathname: string, fallbackLanguage: SiteLanguage) {
  const normalizedPath = normalizeRoutePath(pathname);
  const page = pages[normalizedPath];
  const isKnownPage = Boolean(page);
  const fallbackBase = pages[normalizeRoutePath(localizePath('/', fallbackLanguage))] ?? pages['/'];
  const resolvedPage = page ?? fallbackBase;
  const canonicalUrl = `${siteUrl}${resolvedPage.path}`;
  const locale = resolvedPage.language === 'zh' ? 'zh_CN' : 'en_US';

  document.title = resolvedPage.title;
  setCanonical(canonicalUrl);
  setAlternateLinks(resolvedPage.basePath);
  setMeta('meta[name="description"]', { name: 'description', content: resolvedPage.description });
  setMeta('meta[name="author"]', { name: 'author', content: '刘柏希 / Cyril Liu' });
  setMeta('meta[name="robots"]', {
    name: 'robots',
    content: isKnownPage ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' : 'noindex,follow',
  });
  setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: '刘柏希 / Cyril Liu' });
  setMeta('meta[property="og:type"]', { property: 'og:type', content: resolvedPage.type === 'website' ? 'website' : 'article' });
  setMeta('meta[property="og:title"]', { property: 'og:title', content: resolvedPage.title });
  setMeta('meta[property="og:description"]', { property: 'og:description', content: resolvedPage.description });
  setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  setMeta('meta[property="og:locale"]', { property: 'og:locale', content: locale });
  setMeta('meta[property="og:locale:alternate"]', {
    property: 'og:locale:alternate',
    content: resolvedPage.language === 'zh' ? 'en_US' : 'zh_CN',
  });
  setMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage });
  setMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
  setMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
  setMeta('meta[property="og:image:alt"]', {
    property: 'og:image:alt',
    content: resolvedPage.language === 'zh' ? '刘柏希个人网站封面' : 'Cyril Liu portfolio cover',
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
  structuredData.textContent = JSON.stringify(buildStructuredData(resolvedPage));
}

export function getSeoRoutes() {
  return Object.keys(pages);
}
